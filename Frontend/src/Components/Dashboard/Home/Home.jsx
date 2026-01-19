import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import $ from "jquery";
import ViewAsanasComponent from "../View-Asanas/ViewAsanas";
import Header from "../Header/Header";

const Home = () => {
  const [user, setUser] = useState(null);
  const [benefits, setBenefits] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    console.log("Stored User:", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert("Please upload an image file (jpg, jpeg, png, or gif)");
      event.target.value = "";
      return false;
    }
  };

  const saveChanges = () => {
    const token = sessionStorage.getItem("token");
    const asanaName = document.getElementById("asanaName").value;
    const asanaDescription = document.getElementById("asanaDescription").value;
    const asanaBenefits = benefits.filter((benefit) => benefit.trim() !== "");
    const asanaImage = document.getElementById("asanaImage").files[0];

    const formData = new FormData();
    formData.append("name", asanaName);
    formData.append("description", asanaDescription);
    formData.append("benefits", JSON.stringify(asanaBenefits));
    formData.append("image", asanaImage);

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    axios
      .post("http://localhost:3001/api/asana/add-asana", formData, {
        headers: headers,
      })
      .then((response) => {
        console.log("API Response:", response.data);
        alert("Asanas added successfully!");
        $("#exampleModalLong").modal("hide");
      })
      .catch(error => {
        console.error('API Error:', error);
        setErrorMessage(error.response.data.message);
      });
  };

  const addBenefitField = () => {
    setBenefits([...benefits, ""]);
  };

  const handleBenefitChange = (index, value) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = value;
    setBenefits(updatedBenefits);
  };

  const removeBenefitField = (index) => {
    const updatedBenefits = [...benefits];
    updatedBenefits.splice(index, 1);
    setBenefits(updatedBenefits);
  };

  return (
    <div className="dashboard">
      <Header></Header>
      <div className="home">
        <div className="username-zone col-5">
          <div className="app-name">
            Welcome to Yoga Planner{" "}
            <h2> {user ? capitalizeFirstLetter(user) : ""} </h2>
          </div>
          <div className="add-asanas">
            As a teacher You can add Asanas by clicking below
            <br />
            <button
              type="button"
              className="button mt-2"
              data-toggle="modal"
              data-target="#exampleModalLong"
            >
              Add asanas
            </button>
            <div
              className="modal fade"
              id="exampleModalLong"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLongTitle"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      className="modal-title"
                      id="exampleModalLongTitle"
                      style={{ color: "black" }}
                    >
                      Add Asanas
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}
                    <div className="form-group">
                      <label htmlFor="asanaName">Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="asanaName"
                        placeholder="Enter asana name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="asanaDescription">Description:</label>
                      <textarea
                        className="form-control"
                        id="asanaDescription"
                        rows="3"
                        placeholder="Enter asana description"
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="asanaBenefits">Benefits:</label>
                      {benefits.map((benefit, index) => (
                        <div key={index} className="d-flex">
                          <input
                            type="text"
                            className="form-control"
                            value={benefit}
                            onChange={(e) =>
                              handleBenefitChange(index, e.target.value)
                            }
                            required
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              className="btn btn-danger ml-2"
                              onClick={() => removeBenefitField(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={addBenefitField}
                      >
                        Add Benefit
                      </button>
                    </div>
                    <div className="form-group">
                      <label htmlFor="asanaImage">Image Upload:</label>
                      <input
                        type="file"
                        className="form-control-file"
                        id="asanaImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="button"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="button"
                      onClick={saveChanges}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
