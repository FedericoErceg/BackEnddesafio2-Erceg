const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  static id = 0;

  async addProduct(title, price, description, thumbnail, code, stock) {
    ProductManager.id++;
    const producto = {
      id: ProductManager.id,
      title: title,
      price: price,
      description: description,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };
    this.products.push(producto);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products),
      "utf-8"
    );
  }

  async getProduct() {
    try {
      const prodJson = await fs.promises.readFile(this.path, "utf-8");
      const productos = JSON.parse(prodJson);
      return productos;
    } catch (err) {
      console.error("Error al obtener productos: " + err);
      return null;
    }
  }

  async getProductById(id) {
    try {
      const prodJson = await fs.promises.readFile(this.path, "utf-8");
      const productos = JSON.parse(prodJson);

      const productById = productos.find((producto) => producto.id === id);

      if (productById) {
        return productById;
      } else {
        console.error("Id del producto no encontrado.");
        return null;
      }
    } catch (err) {
      console.error("Error: " + err);
      return null;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const productos = await this.getProduct();
      let productToUpdate = productos.find((prod) => prod.id === id);

      if (productToUpdate) {
        Object.assign(productToUpdate, updatedProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(productos), 'utf-8');
        return productToUpdate;
      } else {
        console.log("Id del producto no encontrado. No se realizó el reemplazo del producto deseado.");
        return null;
      }
    } catch (err) {
      console.error('Error al actualizar el producto: ' + err);
      return null;
    }
  }

  async deleteProduct(id) {
    try {
      const productos = await this.getProduct();
      const updatedProductos = productos.filter((prod) => prod.id !== id);

      if (updatedProductos.length < productos.length) {
        await fs.promises.writeFile(this.path, JSON.stringify(updatedProductos), 'utf-8');
        console.log("Producto eliminado exitosamente.");
      } else {
        console.log("Id del producto no encontrado. No se realizó la eliminación del producto.");
      }
    } catch (err) {
      console.error('Error al eliminar el producto: ' + err);
    }
  }
}

async function mainCall() {
    let myProductManager = new ProductManager("./productos.json");
  await myProductManager.addProduct(
    "Coca Cola",
    600,
    "Lata de Coca Cola",
    "./coca.png",
    12345,
    100
  );
  await myProductManager.addProduct(
    "7UP",
    500,
    "Lata de 7UP",
    "./7UP.png",
    165,
    2000
  );
  console.log(await myProductManager.getProduct());

}

mainCall();

