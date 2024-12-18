import Categories from "./categories/Categories";
import Offers from "./offers/Offers";

const Admin = () => {
  return (
    <div className="w-screen h-screen">
      <div className="max-w-screen-xl mx-4 lg:mx-auto flex flex-col items-center justify-center">
        <h1 className="mt-10 ml-5 text-4xl font-semibold mb-8">
          Panel Administratora
        </h1>
        <div className="flex flex-col gap-4">
          <section id="categories">
            <Categories />
          </section>
          <section id="offers">
            <Offers />
          </section>
          {/* <section id="products">
            <Products />
          </section> */}
        </div>
      </div>
    </div>
  );
};
export default Admin;
