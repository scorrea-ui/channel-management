import * as FilePond from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

import axios from "axios";

const form = document.querySelector(".c-career__form");

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

const filePondConfig = (name) => {
  FilePond.registerPlugin(FilePondPluginFileValidateSize);
  FilePond.registerPlugin(FilePondPluginFileValidateType);

  FilePond.create(name, {
    acceptedFileTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ],
    fileValidateTypeLabelExpectedTypesMap: "Submit a DOC, DOCX or PDF file",
    labelIdle:
      "Drop file here <span class='c-career__button'>or</span> <span class='c-career__file'>Select File</span>",
  });
};

filePondConfig(document.querySelector(".upload_cv_english_"));
filePondConfig(document.querySelector(".cover_letter_upload_"));

const fileUpload = (element, name) => {
  const hubspotUrl =
    "https://hubspot-recruitment-form.herokuapp.com/fileupload";

  const axiosConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    },
  };

  const fileFormData = new FormData();

  element.addEventListener("FilePond:addfile", async (e) => {
    fileFormData.append("file", e.detail.file.file);
    fileFormData.append("filePath", "Recruitment 2020");

    const res = await axios.post(hubspotUrl, fileFormData, axiosConfig);

    element.value = res.data.url;

    if (name === "upload_cv_english") {
      const { upload_cv_english_ } = form.elements;
      upload_cv_english_.value = res.data.url;
    }

    if (name === "cover_letter_upload") {
      const { cover_letter_upload } = form.elements;
      cover_letter_upload.value = res.data.url;
    }
  });
};

fileUpload(document.querySelector(".upload_cv_english_"), "upload_cv_english");
fileUpload(
  document.querySelector(".cover_letter_upload_"),
  "cover_letter_upload"
);

const setJobApplication = () => {
  const params = new URLSearchParams(window.location.search);
  let jobApplication = "";

  if (params.has("q")) {
    jobApplication = params.get("q");
  } else {
    jobApplication = "Not Valid";
  }

  const { what_job_are_you_applying_for } = form.elements;

  what_job_are_you_applying_for.value = jobApplication.replace(/-/g, " ");
  what_job_are_you_applying_for.disabled = true;
};

setJobApplication();

const submitForm = async (formData) => {
  const options = {
    submittedAt: Date.now(),
    method: "POST",
    body: JSON.stringify({ fields: formData }),
    context: {
      pageUri: "https://www.cloudtask.com/careers/application-steps",
      pageName: "Application Steps",
    },
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Hubspot Related
  const uri = "https://api.hsforms.com/submissions/v3/integration/submit";
  const portalID = 1709048;
  const formID = "bdba73da-e746-4d17-8aa5-7804ecfc52ce";

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
    console.log(result);
  }
};

const GetData = () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const {
      firstname,
      lastname,
      email,
      phone,
      what_job_are_you_applying_for,
      cover_letter_upload,
      vidyard_presentation,
      personality_type_link,
      hr_status,
      upload_cv_english_,
    } = form.elements;

    hr_status.value = "Interested";

    const formData = [
      { name: firstname.name, value: firstname.value },
      { name: lastname.name, value: lastname.value },
      { name: email.name, value: email.value },
      { name: phone.name, value: phone.value },
      {
        name: what_job_are_you_applying_for.name,
        value: what_job_are_you_applying_for.value,
      },
      { name: cover_letter_upload.name, value: cover_letter_upload.value },
      { name: vidyard_presentation.name, value: vidyard_presentation.value },
      { name: personality_type_link.name, value: personality_type_link.value },
      { name: hr_status.name, value: hr_status.value },
      { name: upload_cv_english_.name, value: upload_cv_english_.value },
    ];

    if (form.checkValidity() === false) {
      return false;
    }

    submitForm(formData);
  });
};

GetData();
