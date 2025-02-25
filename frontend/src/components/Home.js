import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="mb-3">Welcome to Peer-to-Peer Chat</h1>
            <p className="lead">Connect directly with your friends using our secure and decentralized chat platform.</p>

            {/* Call-to-Action Buttons */}
            <div className="mt-4">
                <Link to="/login" className="btn btn-primary mx-2">Login</Link>
                <Link to="/signup" className="btn btn-success mx-2">Signup</Link>
            </div>

            {/* Features Section */}
            <div className="mt-5">
                <h2>Why Choose Peer-to-Peer Chat?</h2>
                <ul className="list-unstyled mt-3">
                    <li>✅ End-to-End Encryption for Secure Messaging</li>
                    <li>✅ No Third-Party Servers – Fully Decentralized</li>
                    <li>✅ High-Quality Voice and Video Calls</li>
                    <li>✅ Share Files, Images, and More</li>
                    <li>✅ No Data Collection – Your Privacy Matters</li>
                </ul>
            </div>

            {/* How It Works Section */}
            <div className="mt-5">
                <h2>How It Works</h2>
                <p>Our decentralized chat system connects you directly with your friends. No middlemen, no tracking – just pure, private communication.</p>
                <img src="https://via.placeholder.com/600x300" alt="How It Works" className="img-fluid mt-3" />
            </div>

            {/* FAQ Section */}
            <div className="mt-5">
                <h2>Frequently Asked Questions</h2>
                <div className="text-start mx-auto" style={{ maxWidth: "600px" }}>
                    <p><strong>Q: Is this platform free to use?</strong></p>
                    <p>A: Yes! Our service is completely free and open-source.</p>

                    <p><strong>Q: Can I use it on mobile?</strong></p>
                    <p>A: Yes! Our platform is fully responsive and works on any device.</p>

                    <p><strong>Q: How do I get started?</strong></p>
                    <p>A: Simply sign up and start chatting with your friends in seconds.</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-5 p-3 bg-light">
                <p>© 2024 Peer-to-Peer Chat. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
