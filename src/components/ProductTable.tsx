import { PageState } from "../model/PageState";
import type { Product } from "../model/Product";

interface ProductTableProps {
  products: Array<Product>;
  setPageState: React.Dispatch<React.SetStateAction<PageState>>;
}

export function ProductTable({ products, setPageState }: ProductTableProps) {
  function renderTableRows() {
    function resolveClassName(index: number) {
      if (index % 2 === 0) {
        return "bg-white/10";
      }

      return "";
    }

    return products.map((product, index) => {
      return (
        <tr
          key={`product-table-row-${product.refNo}`}
          className={resolveClassName(index)}
        >
          <td className="text-right p-2">{product.refNo}</td>
          <td className="text-left p-2">{product.label}</td>
          <td className="text-right p-2">{product.count}</td>
        </tr>
      );
    });
  }

  return (
    <div>
      <p className="text-left">
        Die geprüften Rechnungen enthalten folgende Produkte:
      </p>
      <table className="mt-8 mb-8">
        <thead>
          <tr>
            <th className="text-left p-2">Referenznr.</th>
            <th className="text-left p-2">Produktname</th>
            <th className="text-left p-2">Gesamtzahl</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setPageState(PageState.BeforeCalc)}
      >
        Neue PDF auswerten
      </button>
    </div>
  );
}
