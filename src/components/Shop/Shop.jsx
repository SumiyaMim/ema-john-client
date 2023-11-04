import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {

    /**
    * Pagination
    * 1: get the total number of products 
    * 2: number of items per page dynamic
    * 3: get the current page
    * 
    * Example
    * 1. const {count} = useLoaderData()
    * 2. const itemPerPage = 12;
    * 3. const numOfPage = Math/ceil(count / itemPerPage)
    * 4. pages -
    *  const pages = []
        for(let i = 0; i < numberOfPages; i++){
            pages.push(i)
        }
        console.log(pages)
    * or
    * const pages = [...Array(numberOfPages).keys()];
    */

    const [products, setProducts] = useState([]);
    const carts = useLoaderData();
    const [cart, setCart] = useState(carts)
    // const {count} = useLoaderData()
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(18);

    const numberOfPages = Math.ceil(count / itemsPerPage);

    // number of pages
    // const pages = []
    // for(let i = 0; i < numberOfPages; i++){
    //     pages.push(i)
    // }

    // number of pages
    const pages = [...Array(numberOfPages).keys()];
    // console.log(pages)

    useEffect( () =>{
        fetch('https://ema-john-server-bice.vercel.app/productsCount')
        .then(res => res.json())
        .then(data => setCount(data.count))
    }, [])

    useEffect(() => {
        fetch(`https://ema-john-server-bice.vercel.app/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart)
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handleItemsPerPage = e => {
        const val = parseInt(e.target.value);
        // console.log(val);
        setItemsPerPage(val);
        setCurrentPage(0);
    }

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                {/* <p>Current page: {currentPage}</p> */}
                <button onClick={handlePrevPage}>Prev</button>
                {
                    pages.map(page => <button
                        className={currentPage === page ? 'selected' : undefined}
                        onClick={() => setCurrentPage(page)}
                        key={page}
                    >{page}</button>)
                }
                <button onClick={handleNextPage}>Next</button>
                <select value={itemsPerPage} onChange={handleItemsPerPage} className='select-pagination'>
                    <option value="18">18</option>
                    <option value="24">24</option>
                    <option value="30">30</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;