const form = document.querySelector("#updateInventory")
    form.addEventListener("change", function () {
      const updateBtn = document.getElementById("submitButton")
      updateBtn.removeAttribute("disabled")
    })