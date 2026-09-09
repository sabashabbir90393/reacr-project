import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://product-server-production-fba1.up.railway.app/products";

const heroImages = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d25?auto=format&fit=crop&w=1600&q=85",
];

function App() {
  const [products, setProducts] = useState([]);

  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addImageURL, setAddImageURL] = useState("");
  const [addDescription, setAddDescription] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateImageURL, setUpdateImageURL] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  const [search, setSearch] = useState("");
  const [heroImage, setHeroImage] = useState(0);
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // GET PRODUCTS
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showMessage("Error fetching products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // HERO SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImage((previous) => {
        return (previous + 1) % heroImages.length;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ADD PRODUCT
  const addProduct = async (event) => {
    event.preventDefault();

    if (!addName || !addPrice || !addImageURL || !addDescription) {
      showMessage("Please fill all fields.");
      return;
    }

    const newProduct = {
      id: String(Date.now()),
      name: addName,
      price: Number(addPrice),
      imageURL: addImageURL,
      desc: addDescription,
    };

    try {
      const response = await axios.post(API_URL, newProduct);

      setProducts((previous) => [...previous, response.data]);

      setAddName("");
      setAddPrice("");
      setAddImageURL("");
      setAddDescription("");

      showMessage("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      showMessage("Error adding product.");
    }
  };

  // UPDATE PRODUCT
  const updateProduct = async (event) => {
    event.preventDefault();

    if (!updateId) {
      showMessage("Please select a product first.");
      return;
    }

    const updatedProduct = {
      name: updateName,
      price: Number(updatePrice),
      imageURL: updateImageURL,
      desc: updateDescription,
    };

    try {
      const response = await axios.put(
        `${API_URL}/${updateId}`,
        updatedProduct
      );

      setProducts((previous) =>
        previous.map((product) =>
          product._id === updateId || product.id === updateId
            ? response.data
            : product
        )
      );

      clearUpdateForm();
      showMessage("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      showMessage("Error updating product.");
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setProducts((previous) =>
        previous.filter(
          (product) => product._id !== id && product.id !== id
        )
      );

      showMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      showMessage("Error deleting product.");
    }
  };

  // SELECT PRODUCT FOR UPDATE
  const selectProductForUpdate = (product) => {
    const targetId = product._id || product.id;

    setUpdateId(targetId);
    setUpdateName(product.name?.trim() || "");
    setUpdatePrice(product.price || "");
    setUpdateImageURL(product.imageURL || product.imgurl || "");
    setUpdateDescription(product.desc?.trim() || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // CLEAR UPDATE FORM
  const clearUpdateForm = () => {
    setUpdateId("");
    setUpdateName("");
    setUpdatePrice("");
    setUpdateImageURL("");
    setUpdateDescription("");
  };

  // SEARCH
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <a href="#top" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-xl font-black shadow-lg shadow-blue-500/30 transition duration-300 group-hover:scale-105">
              S
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                Shop<span className="text-blue-400">Hub</span>
              </h1>

              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 sm:block">
                Smart Store Management
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#products"
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Products
            </a>

            <a
              href="#manage"
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Manage
            </a>

            <a
              href="#footer"
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md sm:px-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            </span>

            <span className="text-xs font-bold text-slate-200 sm:text-sm">
              {products.length} Products
            </span>
          </div>

        </div>
      </nav>

      <div id="top"></div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="relative h-[560px] sm:h-[620px]">

          {heroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Shop product"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                heroImage === index
                  ? "scale-100 opacity-100"
                  : "scale-105 opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20"></div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20"></div>

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">

            <div className="max-w-3xl text-white">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300 backdrop-blur-md">
                <span>✦</span>
                Premium Shopping Experience
              </div>

              <h2 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Everything You Need.
                <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-white bg-clip-text text-transparent">
                  All In One Place.
                </span>
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Discover a curated collection of modern products with
                quality, style and a seamless shopping experience.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">

                <a
                  href="#products"
                  className="group rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-2xl transition duration-300 hover:-translate-y-1 hover:bg-blue-50"
                >
                  Explore Collection
                  <span className="ml-2 transition group-hover:ml-3">
                    →
                  </span>
                </a>

                <a
                  href="#manage"
                  className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  Manage Store
                </a>

              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400">

                <div>
                  <p className="text-2xl font-black text-white">
                    {products.length}+
                  </p>
                  <p>Products</p>
                </div>

                <div className="h-10 w-px bg-white/20"></div>

                <div>
                  <p className="text-2xl font-black text-white">
                    100%
                  </p>
                  <p>Responsive</p>
                </div>

                <div className="h-10 w-px bg-white/20"></div>

                <div>
                  <p className="text-2xl font-black text-white">
                    Fast
                  </p>
                  <p>Management</p>
                </div>

              </div>

            </div>
          </div>

          {/* SLIDER DOTS */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">

            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setHeroImage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  heroImage === index
                    ? "w-10 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              ></button>
            ))}

          </div>

        </div>
      </section>

      {/* MAIN */}
      <main
        id="manage"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >

        {/* SECTION HEADING */}
        <div className="mb-10 text-center">

          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Store Management
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Manage Your Products
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Add new products, update existing information and keep your
            online store organized.
          </p>

        </div>

        {/* FORMS */}
        <section className="grid gap-7 lg:grid-cols-2">

          {/* ADD PRODUCT */}
          <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-20px_rgba(37,99,235,0.22)] sm:p-8">

            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100/60 blur-3xl"></div>

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/25">
                    +
                  </div>

                  <span className="ml-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                    Create
                  </span>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  New
                </span>

              </div>

              <h3 className="text-2xl font-black tracking-tight text-slate-950">
                Add Product
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create a new product and add it to your store collection.
              </p>

              <form
                onSubmit={addProduct}
                className="mt-7 space-y-4"
              >

                <input
                  type="text"
                  placeholder="Product name"
                  value={addName}
                  onChange={(event) => setAddName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={addPrice}
                  onChange={(event) => setAddPrice(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={addImageURL}
                  onChange={(event) =>
                    setAddImageURL(event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <textarea
                  rows="3"
                  placeholder="Product description"
                  value={addDescription}
                  onChange={(event) =>
                    setAddDescription(event.target.value)
                  }
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                ></textarea>

                <button
                  type="submit"
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-600/30"
                >
                  <span className="text-lg">+</span>
                  Add Product
                  <span className="transition group-hover/btn:translate-x-1">
                    →
                  </span>
                </button>

              </form>

            </div>
          </div>

          {/* UPDATE PRODUCT */}
          <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-20px_rgba(245,158,11,0.22)] sm:p-8">

            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-100/60 blur-3xl"></div>

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-xl text-white shadow-lg shadow-amber-500/25">
                    ✎
                  </div>

                  <span className="ml-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                    Edit
                  </span>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Update
                </span>

              </div>

              <h3 className="text-2xl font-black tracking-tight text-slate-950">
                Update Product
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select any product and update its details instantly.
              </p>

              <form
                onSubmit={updateProduct}
                className="mt-7 space-y-4"
              >

                <input
                  type="text"
                  placeholder="Product name"
                  value={updateName}
                  onChange={(event) =>
                    setUpdateName(event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={updatePrice}
                  onChange={(event) =>
                    setUpdatePrice(event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={updateImageURL}
                  onChange={(event) =>
                    setUpdateImageURL(event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                />

                <textarea
                  rows="3"
                  placeholder="Product description"
                  value={updateDescription}
                  onChange={(event) =>
                    setUpdateDescription(event.target.value)
                  }className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition duration-200 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                ></textarea>

                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-amber-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-amber-500/30"
                  >
                    Update Product
                  </button>

                  <button
                    type="button"
                    onClick={clearUpdateForm}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-sm font-black text-slate-700 transition duration-300 hover:bg-slate-100"
                  >
                    Clear
                  </button>

                </div>

              </form>

            </div>
          </div>

        </section>

        {/* MESSAGE */}
        {message && (
          <div className="fixed right-4 top-24 z-[60] max-w-[calc(100%-2rem)] rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs">
                ✓
              </span>
              {message}
            </div>
          </div>
        )}

        {/* PRODUCTS SECTION START */}
        <section id="products" className="mt-20">

          <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                Our Collection
              </span>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Explore Products
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Browse our complete collection and manage your products
                with ease.
              </p>

            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-96">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search your products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm font-medium shadow-[0_10px_35px_-15px_rgba(15,23,42,0.25)] outline-none transition duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 transition hover:text-slate-700"
                >
                  ✕
                </button>
              )}

            </div>

          </div>

          {/* PRODUCT COUNT BAR */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-black text-blue-600">
                {filteredProducts.length}
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">
                  Available Products
                </p>

                <p className="text-xs text-slate-400">
                  {search
                    ? `Results for "${search}"`
                    : "Complete store collection"}
                </p>
              </div>

            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
              ● Store Active
            </span>

          </div>
          {/* PRODUCT GRID */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
                📦
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-900">
                No Products Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find a product matching your search.
                Try another keyword or add a new product.
              </p>

            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_45px_-20px_rgba(15,23,42,0.25)] transition-all duration-500 hover:-translate-y-2 hover:border-blue-100 hover:shadow-[0_30px_70px_-25px_rgba(37,99,235,0.28)]"
                >

                  {/* IMAGE */}
                  <div className="relative h-72 overflow-hidden bg-slate-100">

                    <img
                      src={product.imageURL || product.imgurl}
                      alt={product.name?.trim() || "Product"}
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"></div>

                    <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-lg backdrop-blur">
                      Featured
                    </div>

                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/80 text-sm text-slate-700 shadow-lg backdrop-blur">
                      ✦
                    </div>

                  </div>

                  {/* PRODUCT CONTENT */}
                  <div className="p-6">

                    <h3 className="text-xl font-black leading-tight text-slate-950 transition duration-300 group-hover:text-blue-600">
                      {product.name?.trim() || "Unnamed Product"}
                    </h3>

                    <p className="mt-3 min-h-[50px] text-sm leading-6 text-slate-500">
                      {product.desc?.trim() ||
                        "No description available."}
                    </p>

                    <div className="my-5 h-px bg-slate-100"></div>

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                          <span className="text-sm font-bold text-slate-400">
                            Rs.
                          </span>{" "}
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span className="rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                        In Stock
                      </span>

                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          selectProductForUpdate(product)
                        }
                        className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-lg hover:shadow-amber-500/10"
                      >
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(
                            product._id || product.id
                          )
                        }
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition duration-300 hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-lg hover:shadow-red-500/10"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer
        id="footer"
        className="mt-20 overflow-hidden bg-slate-950 text-white"
      >

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="grid gap-10 md:grid-cols-3">

            {/* BRAND */}
            <div className="md:col-span-2">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-xl font-black shadow-lg shadow-blue-500/20">
                  S
                </div>

                <div>
                  <h3 className="text-2xl font-black">
                    Shop<span className="text-blue-400">Hub</span>
                  </h3>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                    Smart Store Management
                  </p>
                </div>

              </div>

              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                A modern product management system designed for a
                smooth, responsive and organized shopping experience.
              </p>

           <div className="mt-6 flex gap-3">

  {/* Facebook */}
  <a
    href="#"
    aria-label="Facebook"
    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M14 8h3V5h-3c-2.8 0-5 2.2-5 5v2H6v3h3v6h3v-6h3l1-3h-4v-2c0-1.1.9-2 2-2z" />
    </svg>
  </a>

  {/* Instagram */}
  <a
    href="#"
    aria-label="Instagram"
    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:bg-pink-600 hover:text-white hover:shadow-lg hover:shadow-pink-600/20"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href="#"
    aria-label="LinkedIn"
    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:text-white hover:shadow-lg hover:shadow-blue-700/20"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M6.5 8.5A1.75 1.75 0 1 0 6.5 5a1.75 1.75 0 0 0 0 3.5ZM5 10h3v9H5v-9Zm5 0h2.9v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V19h-3v-4.2c0-1-.02-2.28-1.4-2.28-1.4 0-1.62 1.1-1.62 2.2V19h-3v-9Z" />
    </svg>
  </a>

</div>

            </div>

            {/* QUICK LINKS */}
            <div>

              <h4 className="text-sm font-black uppercase tracking-widest">
                Quick Links
              </h4>

              <div className="mt-5 space-y-3 text-sm text-slate-400">

                <a
                  href="#top"
                  className="block transition hover:translate-x-1 hover:text-white"
                >
                  Home
                </a>

                <a
                  href="#products"
                  className="block transition hover:translate-x-1 hover:text-white"
                >
                  Products
                </a>

                <a
                  href="#manage"
                  className="block transition hover:translate-x-1 hover:text-white"
                >
                  Manage Products
                </a>

              </div>

            </div>

          </div>

          <div className="my-8 h-px bg-white/10"></div>

          <div className="flex flex-col gap-2 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <p>
              © 2026 ShopHub. All rights reserved.
            </p>

            <p>
              Product Management System
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;