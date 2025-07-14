document.addEventListener("DOMContentLoaded", () => {


    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
        const button = form.querySelector("button[type='submit']");
        const inputs = form.querySelectorAll("input");
        inputs.forEach((input) => {
            input.addEventListener("input", () => {
                validateInput(input);
                button.disabled = !isFormValid(form);
            });
            if (input.type === 'file') {
                input.addEventListener("change", () => {
                    validateInput(input);
                    button.disabled = !isFormValid(form);
                })
            }
        });
        const textareas = form.querySelectorAll("textarea");
        textareas.forEach((tarea) => {
            tarea.addEventListener("input", () => {
                validateInput(tarea);
                button.disabled = !isFormValid(form);
            })
        })
    });
    function validateInput(input) {
        var errorMessage = input
            .closest(".form-group")
            .querySelector(".error-message");
        errorMessage.style.color = "#526C7FCC"
        errorMessage.style.display = "block"
        if (["Name", "Compatibility"].includes(input.id) &&
            (input.value.length < 2 || input.value.length > 64)) {
            errorMessage.style.color = "red";
        } else if (input.id === "Type" &&
            (!/^[а-яА-ЯёЁ\s\-]{2,64}$/.test(input.value))) {
            errorMessage.style.color = "red";
        } else if (input.id === "Manufacturer" && !/^[a-zA-Zа-яА-ЯёЁ0-9\s\-]{2,64}$/.test(input.value)) {
            errorMessage.style.color = "red";
        } else if (input.id === "Description" && (input.value.length < 8 || input.value.length > 1024)) {
            errorMessage.style.color = "red";
        } else if (input.id === "Price" && !/^(?!0+$)[1-9]\d*$/.test(input.value)) {
            errorMessage.style.color = "red";
        } else if (input.id === "imageFile") {
            const file = input.files[0];
            if (!file || !file.type.match('image.*')) {
                errorMessage.style.color = "red";
            }
        } else if (input.id === "Number" && !/^[a-zA-Z0-9]{2,64}$/.test(input.value)) {
            errorMessage.style.color = "red";
        }
    }

    function isFormValid(form) {
        return [...form.querySelectorAll("input, textarea, select")]
            .every((input) => {
                const errorMessage = input.closest(".form-group")?.querySelector(".error-message");
                return errorMessage ? errorMessage.style.color !== "red" : true;
            });
    }
  
});


document.getElementById('imageFile').addEventListener('change', function (e) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const basestring = reader.result.replace("data:", "").replace(/^.+,/, "");
            document.getElementById('ImageField').value = basestring;
        };
        reader.readAsDataURL(file);
    }
})





