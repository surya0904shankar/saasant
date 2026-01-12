const NavbarWidget = ({ props }) => {
    const { logo = 'My Website', links = ['Home', 'About', 'Services', 'Contact'] } = props;

    return (
        <div className="navbar-widget">
            <div className="navbar-widget-content">
                <div className="navbar-logo">{logo}</div>
                <nav className="navbar-links">
                    {links.map((link, index) => (
                        <a key={index} href="#" className="navbar-link">
                            {link}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default NavbarWidget;
