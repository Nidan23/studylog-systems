import axios from 'axios'       // Axios is my favourite framework 4 http request, so I decided to use it
import fs from 'fs'         // Extract all files, so write them somewhere >?

const allProducts = []
const priceObject = {
    minPrice: 0,
    maxPrice: 1000
}

while(priceObject.maxPrice <= 100_000){
    await axios.get('https://api.ecommerce.com/products', {
        params: {
            minPrice: priceObject.minPrice,
            maxPrice: priceObject.maxPrice
        }
    })
        .then(result => {
            if(parseInt(result.data['count']) === 1000){   // 4 purposes of clean code I decided to use ['count'] instead of .count because count() is global function
                priceObject.maxPrice -= 50      // Simple & works
            } else {
                allProducts.push(result.data.products)      // Pushing req products
                
                priceObject.minPrice = priceObject.maxPrice

                if((priceObject.maxPrice + 1000) > 100_000) {
                    priceObject.maxPrice += 100_000 - priceObject.maxPrice
                }
                else if(priceObject.maxPrice === 100_000) {         // I wanted to use if statement without braces, but It won't be as clean as it is now
                    break
                }
                else {
                    priceObject.maxPrice += 1000       // With more information I could optimize this process, but 4 now I think it's ok (not good, only ok :) )
                }
            }
        })
}

fs.writeFileSync('./products.json', '')     // Creating file not exists

const productWriteStream = fs.createWriteStream('./products.json')      // Creating writeStream

productWriteStream.once('open', () => {
    productWriteStream.write(allProducts)       // Writing Data
    productWriteStream.end()
})