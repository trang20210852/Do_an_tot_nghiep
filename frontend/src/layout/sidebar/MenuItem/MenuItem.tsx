import React from "react";
import { Link } from "react-router-dom";
type Props = {
    linkPage: string;
    icon: React.ElementType;
    name: string;
};
export default function MenuItem(props: Props) {
    const { linkPage, icon: Icon, name } = props;

    return (
        <div className="item">
            <Link className="link" to={linkPage} style={{ color: "unset", textDecoration: "none " }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon className="icon" color="inherit" width="30px" height="30px" />

                    <span className="title">{name}</span>
                </div>
            </Link>
        </div>
    );
}
