import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShoppingBag, Smartphone, Package, Shirt, Tag } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Apply a spring for smoother scroll scrub overall
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // === Box Animations ===
    // Move box up from the bottom early on
    const translateYBox = useTransform(smoothProgress, [0, 0.2, 0.8, 1], ["60vh", "30vh", "30vh", "30vh"]);

    // Flap opening animations (0.2 to 0.4)
    // Front flap folds down (negative rotateX on the flap local axis)
    const frontFlapRotate = useTransform(smoothProgress, [0.2, 0.4], [0, -160]);
    const backFlapRotate = useTransform(smoothProgress, [0.2, 0.4], [0, 160]);
    const rightFlapRotate = useTransform(smoothProgress, [0.2, 0.4], [0, 160]);
    const leftFlapRotate = useTransform(smoothProgress, [0.2, 0.4], [0, -160]);

    // === Items Animations ===
    // 0.4 - 0.6: Items fly out up
    // 0.6 - 0.8: Items fall down to the floor

    // Item 1: Shopping Bag (Center Left)
    const item1Y = useTransform(smoothProgress, [0.35, 0.55, 0.75], [0, -350, -50]);
    const item1X = useTransform(smoothProgress, [0.35, 0.55, 0.75], [0, -150, -250]);
    const item1Rot = useTransform(smoothProgress, [0.35, 0.75], [0, -45]);
    const item1Scale = useTransform(smoothProgress, [0.35, 0.45], [0.1, 1]);

    // Item 2: Smartphone (Center Right)
    const item2Y = useTransform(smoothProgress, [0.38, 0.58, 0.78], [0, -400, -80]);
    const item2X = useTransform(smoothProgress, [0.38, 0.58, 0.78], [0, 180, 280]);
    const item2Rot = useTransform(smoothProgress, [0.38, 0.78], [0, 30]);
    const item2Scale = useTransform(smoothProgress, [0.38, 0.48], [0.1, 1]);

    // Item 3: Package (Far Left)
    const item3Y = useTransform(smoothProgress, [0.4, 0.6, 0.8], [0, -250, 40]);
    const item3X = useTransform(smoothProgress, [0.4, 0.6, 0.8], [0, -250, -400]);
    const item3Rot = useTransform(smoothProgress, [0.4, 0.8], [0, -80]);
    const item3Scale = useTransform(smoothProgress, [0.4, 0.5], [0.1, 1.2]);

    // Item 4: Shirt (Far Right)
    const item4Y = useTransform(smoothProgress, [0.42, 0.62, 0.82], [0, -300, 20]);
    const item4X = useTransform(smoothProgress, [0.42, 0.62, 0.82], [0, 250, 400]);
    const item4Rot = useTransform(smoothProgress, [0.42, 0.82], [0, 60]);
    const item4Scale = useTransform(smoothProgress, [0.42, 0.52], [0.1, 1.1]);

    // Item 5: Tag (Center High)
    const item5Y = useTransform(smoothProgress, [0.45, 0.65, 0.85], [0, -450, -120]);
    const item5X = useTransform(smoothProgress, [0.45, 0.65, 0.85], [0, 0, 50]);
    const item5Rot = useTransform(smoothProgress, [0.45, 0.85], [0, 15]);
    const item5Scale = useTransform(smoothProgress, [0.45, 0.55], [0.1, 0.9]);

    // === Text Reveal Animations ===
    // 0.75 - 0.9: Text fades in and moves up
    const textOpacity = useTransform(smoothProgress, [0.75, 0.95], [0, 1]);
    const textY = useTransform(smoothProgress, [0.75, 0.95], [100, 0]);

    // Background Parallax
    const bgY = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);

    return (
        <div className={styles.wrapper} ref={containerRef}>
            <div className={styles.stickyContainer}>

                {/* Subtle Background Particles */}
                <motion.div style={{ y: bgY }} className={styles.scene}>
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.particle}
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </motion.div>

                {/* Brand Text Reveal */}
                <motion.div
                    className={styles.textContainer}
                    style={{
                        opacity: textOpacity,
                        y: textY
                    }}
                >
                    <h1 className={styles.brandText}>Shoppy</h1>
                    <p className={styles.tagline}>The Smart Way to Manage Your Online Store</p>
                </motion.div>

                {/* 3D Box and Items */}
                <div className={styles.scene}>
                    <motion.div
                        className={styles.boxWrapper}
                        style={{ y: translateYBox }}
                    >
                        <div className={styles.box}>

                            {/* Box Faces */}
                            <div className={`${styles.face} ${styles.back}`}>
                                {/* Back flap */}
                                <motion.div
                                    className={`${styles.flap} ${styles.flapBack}`}
                                    style={{ rotateX: backFlapRotate }}
                                />
                            </div>
                            <div className={`${styles.face} ${styles.left}`}>
                                {/* Left flap */}
                                <motion.div
                                    className={`${styles.flap} ${styles.flapLeft}`}
                                    style={{ rotateX: leftFlapRotate }}
                                />
                            </div>
                            <div className={`${styles.face} ${styles.right}`}>
                                {/* Right flap */}
                                <motion.div
                                    className={`${styles.flap} ${styles.flapRight}`}
                                    style={{ rotateX: rightFlapRotate }}
                                />
                            </div>
                            <div className={`${styles.face} ${styles.bottom}`} />

                            {/* Items bursting from the box (between back and front plains) */}
                            <div className={styles.itemsContainer}>
                                <motion.div
                                    className={`${styles.item} ${styles.itemCard1}`}
                                    style={{ y: item1Y, x: item1X, rotate: item1Rot, scale: item1Scale }}
                                >
                                    <ShoppingBag size={40} />
                                </motion.div>

                                <motion.div
                                    className={`${styles.item} ${styles.itemCard2}`}
                                    style={{ y: item2Y, x: item2X, rotate: item2Rot, scale: item2Scale }}
                                >
                                    <Smartphone size={40} />
                                </motion.div>

                                <motion.div
                                    className={`${styles.item} ${styles.itemCard3}`}
                                    style={{ y: item3Y, x: item3X, rotate: item3Rot, scale: item3Scale }}
                                >
                                    <Package size={40} />
                                </motion.div>

                                <motion.div
                                    className={`${styles.item} ${styles.itemCard4}`}
                                    style={{ y: item4Y, x: item4X, rotate: item4Rot, scale: item4Scale }}
                                >
                                    <Shirt size={40} />
                                </motion.div>

                                <motion.div
                                    className={`${styles.item} ${styles.itemCard5}`}
                                    style={{ y: item5Y, x: item5X, rotate: item5Rot, scale: item5Scale }}
                                >
                                    <Tag size={40} />
                                </motion.div>
                            </div>

                            {/* Front face must be last in DOM to cover items when they are "inside" */}
                            <div className={`${styles.face} ${styles.front}`}>
                                {/* Front flap */}
                                <motion.div
                                    className={`${styles.flap} ${styles.flapFront}`}
                                    style={{ rotateX: frontFlapRotate }}
                                />
                            </div>

                        </div>
                    </motion.div>

                    {/* Floor Shadow for Depth */}
                    <div className={styles.floorShadow} />
                </div>

            </div>
        </div>
    );
}
