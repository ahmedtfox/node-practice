const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  fetch(`product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      /*       if (result.message === "Success!") {
        const articleProduct = document.getElementById(`product${prodId}`);
        articleProduct.innerHTML = "";
      } */
      if (result.message === "Success!") {
        const productElement = btn.closest("article");
        productElement.parentNode.removeChild(productElement);
      }
    })
    .catch((err) => console.log(err));
};
