import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ChevronRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <h3 className={styles.brandName}>Shoppy</h3>
            <p className={styles.brandDesc}>
              Empowering your digital journey with innovative solutions. We build experiences that matter.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
              <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
              <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
              <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
            </div>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li><a href="#"><ChevronRight size={16} /> Home</a></li>
              <li><a href="#"><ChevronRight size={16} /> About Us</a></li>
              <li><a href="#"><ChevronRight size={16} /> Services</a></li>
              <li><a href="#"><ChevronRight size={16} /> Products</a></li>
              <li><a href="#"><ChevronRight size={16} /> Blog</a></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Help & Support</h4>
            <ul className={styles.linksList}>
              <li><a href="#"><ChevronRight size={16} /> FAQ</a></li>
              <li><a href="#"><ChevronRight size={16} /> Shipping Policy</a></li>
              <li><a href="#"><ChevronRight size={16} /> Returns</a></li>
              <li><a href="#"><ChevronRight size={16} /> Order Status</a></li>
              <li><a href="#"><ChevronRight size={16} /> Payment Options</a></li>
            </ul>
          </div>

          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={20} className={styles.contactIcon} />
                <span>123 Innovation Drive, Tech City, TC 90210</span>
              </li>
              <li>
                <Phone size={20} className={styles.contactIcon} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Mail size={20} className={styles.contactIcon} />
                <span>support@shoppy.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Shoppy. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
