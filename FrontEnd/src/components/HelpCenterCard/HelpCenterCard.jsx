import React from "react";
import style from "./HelpCenterCard.module.css";
import { Link } from "react-router-dom";

export default function HelpCard({
  item,
  isActive,
  onClick,
  dynamicSpan,
  isRequest
}) {
  return (
    <div
      className={`${style.card} ${isActive ? style.active : ""}`}
      style={{
        gridRow: window.innerWidth > 768 ? `span ${dynamicSpan}` : "auto",
        height: isActive ? "fit-content" : "100%",
      }}
      onClick={onClick}
    >
      <div
        className={`${style.head} ${isActive ? style.activeHead : ""} ${isRequest ? style.head2 : style.head}`}
      >
        <img src={item.image} alt="" />
        <p> {item.title}</p>
      </div>

      {isActive && item.links && (
        <div className={style.linkDiv}>
          {item.links.map((link, index) => {
            const isObject =
              typeof link === "object" && link?.subLinks;

            if (isObject) {
              return (
                <div key={index} className={style.subLinkGroup}>
                  <p>{index + 1}. {link.head}</p>

                  {link.subLinks.map((sub, i) => (
                    <Link key={i} className={style.links}>
                      {sub}
                    </Link>
                  ))}
                </div>
              );
            }

            return (
              <Link key={index} className={style.links}>
                {index + 1}. {link}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}