export const data = [
    {
        id: 1,
        image: acc,
        title: "Accounts & Profile",
        links: [
            "How to reset password",
            "How do I update my profile",
            "How to change email address",
            "How to enable 2FA",
            "How to deactivate account",
            "How to update phone number",
            "How to reset password",
            "How do I update my profile",
            "How to change email address",
            "How to enable 2FA",
            "How to deactivate account",
            "How to update phone number",
        ]
    },

    {
        id: 2,
        image: buying,
        title: "Buying & Selling",
        links: [
            "How to place an order",
            "How to track my order",
            "How to cancel an order",
            "How to contact seller",
            "Order delivery timeline",
            "How to report an issue with order"
        ]
    },

    {
        id: 3,
        image: market,
        title: "Marketplace Rules",
        links: [
            {
                head: "Legal Policies",
                subLinks: [
                    "Terms & Conditions",
                    "Policies & Guidelines",
                    "User Agreement",
                    "Privacy Rules"
                ]
            },
            {
                head: "Seller Rules",
                subLinks: [
                    "Prohibited items",
                    "Listing guidelines",
                    "Content restrictions",
                    "Pricing policies"
                ]
            },
            {
                head: "Compliance",
                subLinks: [
                    "Account suspension rules",
                    "Violation handling",
                    "Dispute policies"
                ]
            }
        ]
    },

    {
        id: 4,
        image: payment,
        title: "Payments",
        links: [
            "Accepted payment methods",
            "How to add a payment method",
            "How to remove saved card",
            "Payment failure reasons",
            "Transaction history",
            "Download invoices"
        ]
    },

    {
        id: 5,
        image: coins,
        title: "ZPoint",
        links: [
            {
                head: "Earning Points",
                subLinks: [
                    "How to earn ZPoints",
                    "Referral rewards",
                    "Bonus campaigns",
                    "Daily login rewards"
                ]
            },
            {
                head: "Using Points",
                subLinks: [
                    "How to redeem points",
                    "Where to use ZPoints",
                    "Points expiration rules"
                ]
            }
        ]
    },

    {
        id: 6,
        image: quota,
        title: "My Quotes",
        links: [
            "How to create a quote",
            "How to edit a quote",
            "How to delete a quote",
            "How to share quotes",
            "Download quote as PDF",
            "Quote status meaning"
        ]
    },

    {
        id: 7,
        image: technical,
        title: "Technical Issues",
        links: [
            {
                head: "Common Issues",
                subLinks: [
                    "App not loading",
                    "Login issues",
                    "Page not responding",
                    "Server errors"
                ]
            },
            {
                head: "Fixes",
                subLinks: [
                    "Clear cache steps",
                    "Update browser",
                    "Check internet connection",
                    "Reinstall application"
                ]
            }
        ]
    },

    {
        id: 8,
        image: other,
        title: "Others",
        links: [
            "FAQs",
            "Contact support",
            "Feedback submission",
            "Report a bug",
            "Request a feature",
            "Community guidelines"
        ]
    }
];


import { Search } from 'lucide-react'
import React, { useState } from 'react'
import style from './HelpCenter.module.css'
import HelpCard from '../../components/HelpCenterCard/HelpCenterCard'

import acc from '../../assets/acc.png'
import buying from '../../assets/buying.png'
import market from '../../assets/market.png'
import payment from '../../assets/payment.png'
import coins from '../../assets/coins.png'
import quota from '../../assets/quota.png'
import technical from '../../assets/technical.png'
import other from '../../assets/other.png'
import back from '../../assets/image.png'
import { useNavigate } from 'react-router-dom';


export default function HelpCenter() {

    const navigate = useNavigate();
    const [activeId, setActiveId] = useState(null)

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

        return Math.max(2, Math.ceil(total / 7) + 1)
    }

    return (
        <div className={style.mainDiv}>
            <h3 className={style.mainHead}>Help Center</h3>

            <div
                className={style.banner}
                style={{ backgroundImage: `url(${back})` }}
            >
                <p>
                    Hello! <br />
                    <span>Your Queries, Our Priority</span>
                </p>

                <div className={style.searchout}>
                    <div className={style.search}>
                        <Search size={20} color="#8a8a8a" />
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>
            </div>

            <div className={style.container}>
                {data.map((item) => (
                    <HelpCard
                        key={item.id}
                        item={item}
                        isActive={activeId === item.id}
                        onClick={() =>
                            setActiveId(activeId === item.id ? null : item.id)
                        }
                        dynamicSpan={getDynamicSpan(item)}
                    />
                ))}
            </div>

            <div className={style.extra}>
                <h3>Still need Help?</h3>
                <p>Escalate your issue to Zukarte Teams</p>
                <button onClick={() => navigate('/submitRequest')}>Submit a request</button>
            </div>
        </div>
    )
}