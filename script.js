// ========================================
// HEART AND CRUMB BAKERY
// SHOPPING CART AND CONTACT FORM
// ========================================
// Welcome message when the website opens

document.addEventListener("DOMContentLoaded", function () {
// Welcome message ONLY on the homepage
window.addEventListener("load", function() {

    if (window.location.pathname.endsWith("index.html")) {

        alert("Welcome to Heart and Crumb Bakery! ❤️ Freshly baked with love, just for you!");

    }

});
    // ========================================
    // 1. SHOPPING CART ELEMENTS
    // ========================================

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartMessage = document.getElementById("cart-message");
    const clearCartButton = document.getElementById("clear-cart");
    const cartCount = document.getElementById("cart-count");

    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    // Restore previously saved products
    let cart = [];

    try {
        const savedCart = localStorage.getItem("heartCrumbCart");

        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);

            if (Array.isArray(parsedCart)) {
                cart = parsedCart.filter(function (item) {
                    return (
                        typeof item.name === "string" &&
                        item.name.length > 0 &&
                        Number.isFinite(item.price) &&
                        item.price >= 0 &&
                        Number.isInteger(item.quantity) &&
                        item.quantity > 0
                    );
                });
            }
        }
    } catch (error) {
        console.error("Could not restore the saved cart:", error);
    }

    // ========================================
    // 2. SAVE CART
    // ========================================

    function saveCart() {
        try {
            localStorage.setItem(
                "heartCrumbCart",
                JSON.stringify(cart)
            );
        } catch (error) {
            console.error("Could not save the cart:", error);

            if (cartMessage) {
                cartMessage.textContent =
                    "Your cart could not be saved on this device.";
            }
        }
    }

    // ========================================
    // 3. ADD PRODUCTS TO CART
    // ========================================

    addToCartButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const name = button.dataset.name;
            const priceText = button.dataset.price;
            const price = Number(priceText);

            if (
                !name ||
                priceText === undefined ||
                priceText.trim() === "" ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                alert("Sorry, this product has invalid information.");
                return;
            }

            const existingProduct = cart.find(function (item) {
                return item.name === name && item.price === price;
            });

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            saveCart();
            displayCart();

            if (cartMessage) {
                cartMessage.textContent =
                    name + " added to your cart!";
            }

        });

    });

    // ========================================
    // 4. DISPLAY CART AND TOTAL
    // ========================================

    function displayCart() {

        if (!cartItems || !cartTotal) {
            return;
        }

        cartItems.replaceChildren();

        let total = 0;
        let totalQuantity = 0;

        cart.forEach(function (item, index) {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;
            totalQuantity += item.quantity;

            const productDiv = document.createElement("div");
            productDiv.className = "cart-item";

            const productName = document.createElement("p");

            productName.textContent =
                item.name + " x " + item.quantity;

            const productPrice = document.createElement("p");

            productPrice.textContent =
                "Price: R" + itemTotal.toFixed(2);

            // Reduce quantity
            const minusButton = document.createElement("button");

            minusButton.type = "button";
            minusButton.textContent = "−";
            minusButton.setAttribute(
                "aria-label",
                "Remove one " + item.name
            );

            minusButton.addEventListener("click", function () {

                item.quantity--;

                if (item.quantity <= 0) {
                    cart.splice(index, 1);
                }

                saveCart();
                displayCart();

            });

            // Increase quantity
            const plusButton = document.createElement("button");

            plusButton.type = "button";
            plusButton.textContent = "+";
            plusButton.setAttribute(
                "aria-label",
                "Add one " + item.name
            );

            plusButton.addEventListener("click", function () {

                item.quantity++;

                saveCart();
                displayCart();

            });


// Remove the entire product
const removeButton = document.createElement("button");

removeButton.type = "button";
removeButton.textContent = "Remove";
removeButton.className = "remove-item";

removeButton.addEventListener("click", function () {

    // Check whether the product still exists
    if (!cart[index] || cart[index].name !== item.name) {

        if (cartMessage) {
            cartMessage.textContent =
                "Error: This item is no longer in your cart. Please refresh your cart and try again.";

            cartMessage.style.color = "#c0392b";
        }

        displayCart();
        return;
    }

    // Remove the product
    const removedItem = cart[index];

    cart.splice(index, 1);

    saveCart();
    displayCart();

    if (cartMessage) {
        cartMessage.textContent =
            removedItem.name + " has been successfully removed from your cart.";

        cartMessage.style.color = "green";
    }

});


            productDiv.appendChild(productName);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(minusButton);
            productDiv.appendChild(plusButton);
            productDiv.appendChild(removeButton);

            cartItems.appendChild(productDiv);

        });

        cartTotal.textContent = "R" + total.toFixed(2);

        // Update cart quantity badge
        if (cartCount) {
            cartCount.textContent = totalQuantity;
        }

        // Update empty cart message
        if (cart.length === 0 && cartMessage) {
            cartMessage.textContent =
                "Your cart is empty. Add your favourite baked goods!";
        }

    }

    // ========================================
    // 5. CLEAR THE CART
    // ========================================

    if (clearCartButton) {

        clearCartButton.addEventListener("click", function () {

            cart = [];

            saveCart();
            displayCart();

            if (cartMessage) {
                cartMessage.textContent =
                    "Your shopping cart has been cleared.";
            }

        });

    }

    // Restore the cart when the page opens
    displayCart();

    // ========================================
    // ========================================
// 6. CHECKOUT - OPEN THE CONTACT FORM
// ========================================


// ========================================
// 6. CHECKOUT - OPEN THE CONTACT FORM
// ========================================

const checkoutButton = document.querySelector(".checkout-button");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function (event) {
        event.preventDefault();

        // Save the current cart, even if it is empty
        saveCart();

        // Allow the customer to visit the Contact page
        window.location.href = "Contact.html";
    });
}


   
// ========================================
// 7. CONTACT FORM AND WHATSAPP ORDER
// ========================================

const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");

if (contactForm && feedback) {

    contactForm.addEventListener("submit", function (event) {

        // Stop the page from refreshing immediately
        event.preventDefault();

        const nameField = document.getElementById("name");
        const emailField = document.getElementById("email");
        const phoneField = document.getElementById("phone");
        const messageField = document.getElementById("message");

        // Check that the required fields exist
        if (!nameField || !emailField || !messageField) {
            feedback.textContent =
                "The form is missing a required field.";
            feedback.style.color = "red";
            return;
        }

        // Get customer information
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const phone = phoneField ? phoneField.value.trim() : "";
        const message = messageField.value.trim();

        // Validate required fields
        if (!name || !email || !message) {
            feedback.textContent =
                "Please complete your name, email and message.";
            feedback.style.color = "red";
            return;
        }

        // Validate email address
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            feedback.textContent =
                "Please enter a valid email address.";
            feedback.style.color = "red";
            return;
        }

        // Read the saved shopping cart
        let orderCart = [];

        try {
            const savedCart = localStorage.getItem("heartCrumbCart");

            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);

                if (Array.isArray(parsedCart)) {
                    orderCart = parsedCart.filter(function (item) {
                        return (
                            item &&
                            typeof item.name === "string" &&
                            Number.isFinite(item.price) &&
                            item.price >= 0 &&
                            Number.isInteger(item.quantity) &&
                            item.quantity > 0
                        );
                    });
                }
            }
        } catch (error) {
            console.error("Could not load the shopping cart:", error);

            feedback.textContent =
                "We could not load your cart. Please try again.";
            feedback.style.color = "red";
            return;
        }

        // Calculate the order total
        let total = 0;

        orderCart.forEach(function (item) {
            total += item.price * item.quantity;
        });
if (orderCart.length > 0 && total < 50) {

    feedback.textContent =
        "Your order must be at least R50. Please add more products or contact us for an enquiry.";

    feedback.style.color = "#c0392b";
    feedback.style.fontWeight = "bold";

    return;
}
        // Prepare the WhatsApp message
        let orderMessage =
            "HEART AND CRUMB BAKERY - ORDER / ENQUIRY\n\n" +
            "Customer: " + name + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + (phone || "Not provided") + "\n\n";

        if (orderCart.length > 0) {

            orderMessage += "ORDER DETAILS:\n";

            orderCart.forEach(function (item) {
                orderMessage +=
                    item.name +
                    " x " + item.quantity +
                    " = R" +
                    (item.price * item.quantity).toFixed(2) +
                    "\n";
            });

            orderMessage +=
                "\nTOTAL: R" + total.toFixed(2) + "\n\n";

        } else {

            orderMessage +=
                "No products were selected in the shopping cart.\n\n";
        }

        orderMessage +=
            "Message / Special Instructions:\n" +
            message +
            "\n\nPlease confirm availability and collection or delivery details.";

        // Bakery WhatsApp number in South African international format
        const bakeryWhatsAppNumber = "27768227856";

        // Create the WhatsApp order link
        const whatsappURL =
            "https://wa.me/" +
            bakeryWhatsAppNumber +
            "?text=" +
            encodeURIComponent(orderMessage);

        // Display a success message on the page
        feedback.textContent =
            "Thank you, " + name +
            "! Your order is being prepared for confirmation.";
        feedback.style.color = "green";

        // Display the thank-you popup
        alert(
            "Thank you, " + name +
            "! ❤️ Your order is being prepared for confirmation."
        );

        // Open WhatsApp with the prepared order
        window.location.href = whatsappURL;

    });

}




// ========================================
// 8. DISPLAY CART ON THE CONTACT PAGE
// ========================================

const checkoutCartItems =
    document.getElementById("checkout-cart-items");

const checkoutCartTotal =
    document.getElementById("checkout-cart-total");

if (checkoutCartItems && checkoutCartTotal) {

    let checkoutCart = [];

    try {
        const savedCart = localStorage.getItem("heartCrumbCart");

        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);

            if (Array.isArray(parsedCart)) {
                checkoutCart = parsedCart.filter(function (item) {
                    return (
                        item &&
                        typeof item.name === "string" &&
                        Number.isFinite(item.price) &&
                        item.price >= 0 &&
                        Number.isInteger(item.quantity) &&
                        item.quantity > 0
                    );
                });
            }
        }
    } catch (error) {
        console.error("Could not load checkout cart:", error);
    }

    // Clear the old order summary
    checkoutCartItems.replaceChildren();

    if (checkoutCart.length === 0) {

        checkoutCartItems.textContent =
            "Your cart is empty. Please return to the Products page.";

        checkoutCartTotal.textContent = "R0.00";

    } else {

        let total = 0;

        checkoutCart.forEach(function (item) {

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const productLine = document.createElement("p");

            productLine.textContent =
                item.name +
                " x " +
                item.quantity +
                " = R" +
                itemTotal.toFixed(2);

            checkoutCartItems.appendChild(productLine);

        });

        checkoutCartTotal.textContent = "R" + total.toFixed(2);

    }

}
// ========================================
// HEART AND CRUMB - GALLERY IMAGE POPUP
// ========================================

(function () {

    const galleryImages = document.querySelectorAll(".gallery-img");
    const imagePopup = document.getElementById("image-popup");
    const popupImage = document.getElementById("popup-image");
    const closePopup = document.getElementById("close-popup");
    const prevImage = document.getElementById("prev-image");
    const nextImage = document.getElementById("next-image");

    // Only run this code if the gallery exists
    if (!imagePopup || !popupImage || !closePopup ||
        !prevImage || !nextImage || galleryImages.length === 0) {
        return;
    }

    let currentImageIndex = 0;

    // Open enlarged image
    function openGalleryImage(index) {
        currentImageIndex = index;

        popupImage.src = galleryImages[index].src;
        popupImage.alt = galleryImages[index].alt;

        imagePopup.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    // Click an image to enlarge it
    galleryImages.forEach(function (image, index) {
        image.addEventListener("click", function () {
            openGalleryImage(index);
        });
    });

    // Close popup
    function closeGalleryPopup() {
        imagePopup.classList.remove("show");
        document.body.style.overflow = "";
    }

    closePopup.addEventListener("click", closeGalleryPopup);

    // Next image
    nextImage.addEventListener("click", function () {
        currentImageIndex =
            (currentImageIndex + 1) % galleryImages.length;

        openGalleryImage(currentImageIndex);
    });

    // Previous image
    prevImage.addEventListener("click", function () {
        currentImageIndex =
            (currentImageIndex - 1 + galleryImages.length) %
            galleryImages.length;

        openGalleryImage(currentImageIndex);
    });

    // Close when clicking outside the image
    imagePopup.addEventListener("click", function (event) {
        if (event.target === imagePopup) {
            closeGalleryPopup();
        }
    });

    // Keyboard controls
    document.addEventListener("keydown", function (event) {
        if (!imagePopup.classList.contains("show")) {
            return;
        }

        if (event.key === "Escape") {
            closeGalleryPopup();
        }

        if (event.key === "ArrowRight") {
            nextImage.click();
        }

        if (event.key === "ArrowLeft") {
            prevImage.click();
        }
    });

})();
    });

