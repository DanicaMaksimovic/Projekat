const Carts = require("./models/models-cart");



async function createOrUpdateCart(eventId, userId, quantity, createOperation) {
    const cartItem = await Carts.findOne({userId: userId});
    let retCart = cartItem;
    if (!cartItem) {
        if (!createOperation) {
            throw new Error("Nije moguce izmeniti dogadjaj koji nije u korpi");
        }
        // Trenutni korisik nema nista u korpi
        // Treba da napravimo novi objekat koji se cuva u MongoDB
        const newCart = new Carts({
            userId: userId,
            inCart: [
                {
                    eventId: eventId,
                    quantity: quantity
                }
            ]
        });
        await newCart.save();
        retCart = newCart;
    } else {
        // Treba da izmenimo postojeci objekat koji smo dobili kroz cartItem i da ga na kraju sacuvamo
        const cartListItems= cartItem.inCart;
        let pronadjen = false;
        for(let i=0; i<cartListItems.length; i++){
            if (cartListItems[i].eventId === eventId) {
                if (createOperation) {                    
                    throw new Error("Nije moguce izmeniti postojeci dogadjaj u korpi");
                }
                cartListItems[i].quantity += quantity;
                pronadjen = true;
                break;
            }
        }
        if (!pronadjen) {
            cartListItems.push({
                eventId: eventId,
                quantity: quantity
            });
        }
        await cartItem.save();
    }

    return retCart;
}

module.exports = { createOrUpdateCart: createOrUpdateCart };