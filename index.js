const express = require('express');
const { sequelize } = require('./lib');
const { Supplier } = require('./models/Supplier.model');
const { Product } = require('./models/Product.model');
const { Category } = require('./models/Category.model');
const { ProductCategory } = require('./models/ProductCategory');
const app = express();
app.use(express.json());


//Given Data
const suppliersData = [
    { name: 'TechSupplies', contact: 'John Doe', email: 'contact@techsupplies.com', phone: '123-456-7890' },
    { name: 'HomeGoods Co.', contact: 'Jane Smith', email: 'contact@homegoodsco.com', phone: '987-654-3210' },
  ];

  const productsData = [
    { name: 'Laptop', description: 'High-performance laptop', quantityInStock: 50, price: 120099, supplierId: 1 },
    { name: 'Coffee Maker', description: '12-cup coffee maker', quantityInStock: 20, price: 45000, supplierId: 2 },
  ];

  const categoriesData = [
    { name: 'Electronics', description: 'Devices and gadgets' },
    { name: 'Kitchen Appliances', description: 'Essential home appliances for kitchen' },
  ];

// seed_db
app.get('/seed_db',async(req,res)=>{
    try{
    await sequelize.sync({force:true});
    await Supplier.bulkCreate(suppliersData);
    await Product.bulkCreate(productsData);
    await Category.bulkCreate(categoriesData);

    res.status(200).json("Database seeding successfully!");

    }catch(error){
        res.status(500).json({message:"Internal Server Error!",error:error.message});
}
})

 // Create a new supplier
 async function addNewSupplier(newSupplier) {
    let response = await Supplier.create(newSupplier);
    return {response};
 }

 app.post('/suppliers/new',async(req,res)=>{
    try{
        let newSupplier = req.body.newSupplier;
        let result = await addNewSupplier(newSupplier);
        if(!result){
            res.status(404).json("SUpplier has not created!");
        }
        res.status(200).json({newSupplier:result});

    }catch(error){
      res.status(500).json({message:"Internal Server Error",error:error.message});
    }
 })

//  Create a New Product

async function addNewProduct(newProduct) {
    let response = await Product.create(newProduct);
    return{response};
}

app.post('/products/new',async(req,res)=>{
    try{
    let newProduct  = req.body.newProduct ;
    let result = await addNewProduct(newProduct);
    const supplier = await Supplier.findByPk(newProduct.supplierId);
    if(!supplier) {
         res.status(401).json(" Supplier not found.")
    }
    if(!result){
        res.status(404).json("New product has not been created!");
    }
    res.status(200).json({newProduct:result});
    }catch(error){
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
})

// : Create a New Category

async function addNewCategory (newCategory) {
  let response = await Category.create(newCategory);
  return {response};
}

app.post('/categories/new',async(req,res)=>{
    try{
    let newCategory  = req.body.newCategory ;
    let result = await addNewCategory(newCategory);
    res.status(200).json({newCategory: result});
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// Assign a Product to a Category

async function assignProductToCategory(productId, categoryId) {
    let product = await Product.findByPk(productId);
    let category = await Category.findByPk(categoryId);
    if(!product || !category){
        return {}
    }
    await product.addCategory(category);
    return {product};
}


app.post('/products/:productId/assignCategory/:categoryId',async(req,res)=>{
    try{
    let productId  = parseInt(req.params.productId);
    let categoryId  = parseInt(req.params.categoryId);

    let result = await assignProductToCategory(productId,categoryId);

    if(!productId || !categoryId){
        res.status(401).json("Cannot find produt and category Id");
    }
    res.status(200).json({message:"Product assigned to category successfully", product: result});
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// Get All Products by Category

async function findByCategory(id) {
    let response = await Product.findOne({where:{id}});
    return {response};
}

app.get('/categories/:id/products',async(req,res)=>{
    try{
    let id = parseInt(req.params.id);
    let result = await findByCategory(id);
    res.status(200).json({products:result});
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})
//  Update a Supplier

async function updateData(id,supplierBody) {
  let updatedData = await Supplier.findOne({where:{id}});
  if(!updatedData){
    return {};
  }
  await updatedData.set(supplierBody);
  let response = await updatedData.save();
  return response;
}

app.post('/suppliers/:id/update',async(req,res)=>{
    try{
    let id = parseInt(req.params.id);
    let supplierBody = req.body;
    let result = await updateData(id,supplierBody);
    res.status(200).json({updateSupplier: result});
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// Delete a Supplier

async function deleteSupplier(id) {
    let response = await Supplier.findOne({
        where:{id}
    });
  return {response};
}

app.post('/suppliers/delete/:id',async(req,res)=>{
    try{
    let id = parseInt(req.params.id);
    let result = await deleteSupplier(id);
    res.status(200).json({message:"Supplier deleted successfully!"});
    }catch(error){
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }

})

//  Get All Data with Associations
app.get('/suppliers', async (req, res) => {
    try {
      const suppliers = await Supplier.findAll({
        include: [
          {
            model: Product,
            include: [Category],
          },
        ],
      });
      res.status(200).json({ suppliers });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

app.listen(3000,()=>{
    console.log(`Server is running on port ${3000}`);
})
