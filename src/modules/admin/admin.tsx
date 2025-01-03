import Categories from "./categories/Categories";
import Offers from "./offers/Offers";
import Products from "./products/Products";

const Admin = () => {
  return (
      <div className="max-w-screen-xl mx-4 lg:mx-auto flex flex-col items-center justify-center">
        <h1 className="mt-20 ml-5 text-4xl font-semibold mb-10">
          Panel Administratora
        </h1>
        <div className="flex flex-col gap-5 mb-5">
          <section id="categories">
            <Categories />
          </section>
          <section id="products">
            <Products />
          </section>
          <section id="offers">
            <Offers />
          </section>
        </div>
      </div>
  );
};
export default Admin;
