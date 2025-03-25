import { useState, useRef, useEffect } from "react";

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Toggle menu on button click
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-container">
      <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <img src="/icons/settings.png" alt="User Menu" />
      </button>

      <div className={`user-menu ${isOpen ? "active" : ""}`}>
        <ul>
          <li><a href="">Profile </a></li>
          <li><a href="">Settings</a></li>
          <li><a href="">Logout</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsMenu;
