import { ArrowRight, MoveRightIcon, Search, Upload } from 'lucide-react'
import React, { useRef, useState } from 'react'
import style from './SubmitRequest.module.css'
import { data } from '../HelpCenter/HelpCenter'
import HelpCard from '../../components/HelpCenterCard/HelpCenterCard'
import { useNavigate } from 'react-router-dom'

export default function SubmitRequest() {

    const [activeId, setActiveId] = useState(null);
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const handleClick = () => {
        fileInputRef.current.click(); // open file picker
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        console.log(files);

        // Example: loop through files
        for (let i = 0; i < files.length; i++) {
            console.log(files[i].name);
        }
    };

    const getDynamicSpan = (item) => {
        if (activeId !== item.id || !item.links) return 1

        let total = 0

        item.links.forEach((link) => {
            if (typeof link === 'object') {
                total += link.subLinks.length + 0.5
            } else {
                total += 1
            }
        })

        return Math.max(2, Math.ceil(total / 5) + 1)
    }
    return (
        <div>
            <h3 className={style.mainHead}><span onClick={() => navigate('/helpCenter')} >Help Center</span> <span> {" >> "} Submit Request</span></h3>
            <div className={style.mainContainer}>
                <div className={style.formDiv}>
                    <h3>Submit Request</h3>
                    <form className={style.form}>
                        <div className={style.formGroup}>
                            <label htmlFor="firstName">First Name <span>*</span></label>
                            <input
                                type="text"
                                id='firstName'
                                name='firstName'
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="lasttName">Last Name <span>*</span></label>
                            <input
                                type="text"
                                id='lastName'
                                name='lastName'
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="email">Email Address <span>*</span></label>
                            <input
                                type="text"
                                id='email'
                                name='email'
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="emailSubject">Email Subject <span>*  (maximum 100 charecter)</span></label>
                            <input
                                type="text"
                                id='emailSubject'
                                name='emailSubject'
                                maxLength={100}
                                required
                            />
                        </div>
                        <div className={style.formGroup}>
                            <label htmlFor="emailSubject">Case Description <span>*  (maximum 2000 charecter)</span></label>
                            <textarea
                                id='emailSubject'
                                name='emailSubject'
                                maxLength={2000}
                                required
                                className={style.case}
                            />
                        </div>

                        <p>Attach images <span className={style.upload} onClick={handleClick}><Upload size={12} /> Upload</span> <span className={style.uploadDet}>(File Types:JPEG,PNG,PDF,File size 5 MB per image,Number of Images: Maximum 4)</span></p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept=".jpg,.jpeg,.png,.pdf"
                            multiple
                            onChange={handleFileChange}
                        />
                        <div>
                            <input type="checkbox" required />
                            <label htmlFor="conform">Update my profile information with the above given details</label>
                        </div>
                        <div>
                            <button type='submit'>Submit</button>
                        </div>
                    </form>
                </div>
                <div className={style.cardsDiv}>
                    <h3>Articles</h3>
                    <div className={style.searchout}>
                        <div className={style.search}>
                            <Search size={20} color="#8a8a8a" />
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>

                    <div className={style.cards}>
                        {data.map((item) => (
                            <HelpCard
                                key={item.id}
                                item={item}
                                isActive={activeId === item.id}
                                isRequest={true}
                                onClick={() =>
                                    setActiveId(activeId === item.id ? null : item.id)
                                }
                                dynamicSpan={getDynamicSpan(item)}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
