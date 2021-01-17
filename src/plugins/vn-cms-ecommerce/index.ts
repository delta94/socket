export enum TableName {
    Brand = 'ecommerce_brand',
    Seller = 'ecommerce_seller',
    Product = 'ecommerce_product',
    Cart = 'ecommerce_cart',
    Category = 'ecommerce_category',
    Supplier = 'ecommerce_supplier',
    Taxonomy = 'ecommerce_taxonomy',
    Attribute = 'ecommerce_attribute',
    SearchLabel = 'ecommerce_search_label',
    Customer = 'ecommerce_customer',
    Promotion = 'ecommerce_promotion'
}

export { default as Attribute } from './models/Attribute'
export { default as Brand } from './models/Brand'
export { default as Cart } from './models/Cart'
export { default as Category } from './models/Category'
export { default as Customer } from './models/Customer'
export { default as Product } from './models/Product'
export { default as Promotion } from './models/Promotion'
export { default as SearchLabel } from './models/SearchLabel'
export { default as Seller } from './models/Seller'
export { default as Supplier } from './models/Supplier'
export { default as Taxonomy } from './models/Taxonomy'