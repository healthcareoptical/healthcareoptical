import { Product } from '../models/product.js';
import { Category } from '../models/category.js';
import { Brand } from '../models/brand.js';
import mongoose from 'mongoose';

export async function getSelections() {
    const getSelectionReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();
    try {
        let menu = [];
        const categories = await Category.find({status : 'A'});

        if (!categories || categories.length === 0){
            getSelectionReturn.errorCode = 404;
            getSelectionReturn.errorMessage = "No Data Found";
        }

        for (const category of categories) {
            let menuItem = {
                category,
                count :0,
                brands: []
            }
            const categoryProducts = await Product.find({ category: { $eq: category }, status: 'A' }).populate('brand');
            if (categoryProducts && categoryProducts.length > 0){
                const result = categoryProducts.reduce((acc, item) => {
                    const existing = acc.find(obj => obj.brand === item.brand);
                    if (existing) {
                        existing.count += 1; 
                    } else {
                        acc.push({ brand: item.brand, count: 1 }); 
                    }
                    return acc;
                }, []);
                menuItem.brands = result;
                menuItem.count = categoryProducts.length;
            }
            menu.push(menuItem)
        }
        
        if (!menu || menu.length ===0){
            getSelectionReturn.errorCode = 404;
            getSelectionReturn.errorMessage = "No Data Found";
        }
        getSelectionReturn.menu = menu;
        getSelectionReturn.errorCode = 0;
        getSelectionReturn.errorMessage = "";
    } catch {
        getSelectionReturn.errorCode = 500;
        getSelectionReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return getSelectionReturn;
}
