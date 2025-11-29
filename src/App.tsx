import { useState } from "react";
import "./App.css";
import { PageState } from "./model/PageState";
import { DropZone } from "./components/Dropzone";
import type { Product } from "./model/Product";
import { ProductTable } from "./components/ProductTable";

function App() {
  const [pageState, setPageState] = useState<PageState>(PageState.BeforeCalc);
  const [products, setProducts] = useState<Array<Product>>([]);

  function renderContent() {
    switch (pageState) {
      case PageState.AfterCalc:
        return <ProductTable products={products} setPageState={setPageState} />;
      case PageState.BeforeCalc:
        return (
          <DropZone setPageState={setPageState} setProducts={setProducts} />
        );
      default:
    }
  }

  return (
    <>
      <div className="text-9xl">🤖</div>
      <h1 className="mt-2">Ralles Rechnungsroboter</h1>

      <div className="m-16">{renderContent()}</div>
    </>
  );
}

export default App;
