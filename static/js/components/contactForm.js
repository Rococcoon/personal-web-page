const contactFormCss = `
<style>
  :host {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100vw;
  }

  .error {
    color: var(--rose);
    font-size: 0.8em;
  }

  .contactForm {
    align-items: center;
    background-color: var(--base);
    border: 3px solid var(--text);
    color: var(--text);
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: var(--margin-lg);
    padding: var(--padding-xl);
    width: 50%; /* Or use a CSS variable for better control */
  }

  @media (max-width: 900px) {
    .contactForm {
      width: 80%;
    }
  }

  @media (max-width: 500px) {
    .contactForm {
      width: 70%;
    }
  }

  .contactForm form {
    display: flex;
    flex-direction: column;
    margin-top: var(--margin-xl);
    width: 100%;
  }

  .contactForm label {
    font-family: var(--font-primary);
    font-size: var(--font-size-md);
    font-weight: bold;
    margin-top: var(--margin-lg);
  }

  textarea {
    resize: none;
    height: 100px;
  }

  .contactForm input, .contactForm textarea {
    background-color: var(--surface);
    box-shadow: 6px 6px 0 var(--foam);
    font-family: var(--font-secondary);
    margin-bottom: var(--margin-md);
    margin-top: var(--margin-md);
    outline: 3px solid var(--base);
    padding: var(--padding-md);
  }

  .contactForm input:focus, .contactForm textarea:focus {
    outline: 3px solid var(--gold);
    transition: transform 0.3s ease-in-out;
  }

  .contactForm button {
    margin-top: var(--margin-lg);
  }
</style>
`
const contactFormHtml = `
<div class="contactForm">
  <h2 class="heading">Contact Me!</h2>
  <form id="form">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">
    <div id="nameError" class="error"></div>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
    <div id="emailError" class="error"></div>

    <label for="message">Message:</label>
    <textarea id="message" name="message"></textarea>
    <div id="messageError" class="error"></div>

    <button class="buttonPrimary" type="submit">Submit</button>
  </form>
</div>
`;

  /* Component declaration */
class ContactForm extends HTMLElement {
  constructor() {
    super();

    // Attach the shadow DOM
    this.attachShadow({ mode: 'open' });

    // Adopt the global stylesheet:
    if (globalStyles) {
      this.shadowRoot.adoptedStyleSheets = [globalStyles];
    } else {
      console.error("Global styles not loaded yet!"); // Handle this!
    }

    // Get the template content
    const template = document.createElement('template');
    template.innerHTML = `
      ${contactFormCss}
      ${contactFormHtml}
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const form = this.shadowRoot.getElementById('form');
    const nameInput = this.shadowRoot.getElementById('name');
    const emailInput = this.shadowRoot.getElementById('email');
    const messageInput = this.shadowRoot.getElementById('message');

    const nameError = this.shadowRoot.getElementById('nameError');
    const emailError = this.shadowRoot.getElementById('emailError');
    const messageError = this.shadowRoot.getElementById('messageError');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (validateForm()) {
        submitForm(form);
      }
    });

    function isValidEmail(email) {
      // Improved email regex (more comprehensive but still not perfect - server-side is best)
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    }

    function submitForm(form) {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;  // Disable the button

      const formData = new FormData(form);
      fetch('/contact_form_submit', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log('Form submitted successfully!');
          form.reset();
        } else {
          console.error('Error submitting form:', response.status);
          form.reset();
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      })
    }
    
    function validateEmail() {
      if (!isValidEmail(emailInput.value)) {
        emailError.textContent = "Invalid email format.";
        return false;
      } else {
        emailError.textContent = "";
        return true;
      }
    }

    function validateForm() {
      let isValid = true;

      isValid = validateEmail() && isValid;
      isValid = validateMessage() && isValid;
      isValid = validateName() && isValid;

      return isValid;
    }

    function validateMessage() {
      if (messageInput.value.trim() === "") {
        messageError.textContent = "Message is required.";
        return false;
      } else if (messageInput.value.length < 10){
        messageError.textContent = "Message is too short (min. 10 characters)."
        return false;
      } else {
        messageError.textContent = "";
        return true;
      }
    }

    function validateName() {
      if (nameInput.value.trim() == "") {
        nameError.textContent = "Name is required.";
        return false;
      } else {
        nameError.textContent = "";
        return true
      }
    }
  }
}

customElements.define('contact-form', ContactForm);
