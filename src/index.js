const form = document.querySelector("#form");

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const GetData = () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const {
      firstname,
      lastname,
      email,
      phone,
      company,
      comments,
    } = form.elements;

    const formData = [
      { name: firstname.name, value: firstname.value },
      { name: lastname.name, value: lastname.value },
      { name: email.name, value: email.value },
      { name: company.name, value: company.value },
      { name: comments.name, value: comments.value },
      { name: phone.name, value: phone.value },
    ];

    const data = {
      submittedAt: Date.now(),
      fields: formData,
      context: {
        pageUri: "",
        pageName: "Channel Services",
      },
    };

    if (form.checkValidity() === false) {
      return false;
    }

    submitForm(data);
  });
};

const submitForm = async (formData) => {
  const options = {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Hubspot Related
  const uri = "https://api.hsforms.com/submissions/v3/integration/submit";
  const portalID = 1709048;
  const formID = "8dc8b35b-8830-4c26-9fc9-fb54fe3191fd";

  const url = `${uri}/${portalID}/${formID}`;
  const res = await fetch(url, options);
  const result = await res.json();

  if (res.status === 200) {
    window.location.assign(
      "https://www.cloudtask.com/social-lead-generation-thank-you-page-ms"
    );
  } else if (
    res.status === 400 ||
    res.status === 403 ||
    res.status === 404
  ) {
    console.log(res.text());
  }
};

GetData();

const scrollFormIntoView = () => {
  const links = [...document.querySelectorAll(".js-btn")];

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      form.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    });
  });
};

scrollFormIntoView();
