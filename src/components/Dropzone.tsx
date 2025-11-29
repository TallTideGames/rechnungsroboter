import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { PageTextResult } from "pdf-parse";
import type { Product } from "../model/Product";
import { PDFParse } from "pdf-parse";
import { PageState } from "../model/PageState";

PDFParse.setWorker(
  "https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf.worker.mjs",
);

interface DropZoneProps {
  setPageState: React.Dispatch<React.SetStateAction<PageState>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function DropZone({ setPageState, setProducts }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: Array<Blob>) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = async () => {
          const binaryStr = reader.result;
          if (!binaryStr) {
            return;
          }
          const parser = new PDFParse({ data: binaryStr });
          const result = await parser.getText();

          await parser.destroy();

          const productsPerPage: Array<Array<Product>> = result.pages.map(
            (page: PageTextResult) => {
              const lines: Array<string> = page.text.split("\n");

              const productsOnPage: Array<Product> = [];

              lines.forEach((line: string, index) => {
                if (line.startsWith("Rechnung REF ")) {
                  const refNo = line.replace("Rechnung REF ", "");
                  const productLine = lines[index - 3].split("\t");
                  const label = productLine[0].trim();
                  const count = parseInt(productLine[1].trim());

                  const product: Product = {
                    label: label,
                    refNo: refNo,
                    count: count,
                  };

                  productsOnPage.push(product);
                }
              });

              return productsOnPage;
            },
          );

          const totalProducts: Array<Product> = [];

          for (const products of productsPerPage) {
            products.forEach((pageProduct) => {
              const existingProductWithRef: Product | undefined =
                totalProducts.find(
                  (totalsProduct) => totalsProduct.refNo === pageProduct.refNo,
                );
              if (existingProductWithRef) {
                existingProductWithRef.count += pageProduct.count;
              } else {
                totalProducts.push(pageProduct);
              }
            });
          }

          totalProducts.sort((a, b) => {
            if (a.label < b.label) return -1;
            if (a.label > b.label) return 1;
            return 0;
          });

          setPageState(PageState.AfterCalc);
          setProducts(totalProducts);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [setPageState, setProducts],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function resolveDragAreaClassName() {
    const className =
      "p-16 rounded-xl cursor-pointer border-dashed border-white/80 border-3 ";
    const bgColor = isDragActive ? "bg-white/40" : "bg-white/20";
    return className.concat(bgColor);
  }

  return (
    <div {...getRootProps()} className={resolveDragAreaClassName()}>
      <input {...getInputProps()} accept="application/pdf" />
      <p>Hallo Ralf!</p>
      <br />
      <p>
        Zieh die PDF mit den Rechnungen hierher <br /> oder <br /> klicke hier,
        um die PDF-Datei auszuwählen.
      </p>
    </div>
  );
}
