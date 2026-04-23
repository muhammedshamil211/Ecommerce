import React, { useContext, useState } from "react";
import styles from "./EditProfile.module.css";
import { AppContext } from "../../context/AppContext";
import { updateProfile } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {

    const [submitting, setSubmitting] = useState(false);
    const { user, setUser } = useContext(AppContext);
    const currentUser = user.user;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: currentUser.name,
        phone: currentUser.phoneNumber,
        avathar: currentUser.avathar || "",
        address: {
            street: currentUser.address?.street || '',
            city: currentUser.address?.city || '',
            state: currentUser.address?.state || '',
            pincode: currentUser.address?.pincode || ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [name]: value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setSubmitting(true);

            console.log("Form Data:", formData);

            const res = await updateProfile(user.accessToken, formData);

            if (res.success) {
                const updated = {
                    ...user,
                    user: res.user
                }
                setUser(updated);
                localStorage.setItem("user", JSON.stringify(updated));
                navigate(-1);

            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>

            <div className={styles.header}>
                <h2>Edit Profile</h2>
                <p>Update your personal information</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>

                {/* NAME */}

                <div className={styles.formGroup}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* PHONE */}

                <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                {/* AVATAR */}

                <div className={styles.formGroup}>
                    <label>Avatar URL</label>
                    <input
                        type="text"
                        name="avathar"
                        placeholder="https://example.com/avatar.jpg"
                        value={formData.avathar}
                        onChange={handleChange}
                    />
                </div>

                {/* ADDRESS */}

                <h3>Address</h3>

                <div className={styles.formGroup}>
                    <label>Street</label>
                    <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        value={formData.address.street}
                        onChange={handleAddressChange}
                    />
                </div>

                <div className={styles.grid}>

                    <div className={styles.formGroup}>
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.address.city}
                            onChange={handleAddressChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.address.state}
                            onChange={handleAddressChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Pincode</label>
                        <input
                            type="number"
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.address.pincode}
                            onChange={handleAddressChange}
                        />
                    </div>

                </div>

                {/* BUTTONS */}

                <div className={styles.actions}>

                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Update Profile"}
                    </button>

                </div>

            </form>

        </div>
    );
}