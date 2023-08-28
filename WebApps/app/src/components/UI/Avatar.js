import React, { useMemo, useState } from 'react';

const Avatar = (props) => {

    const { name, lastName, picture, hideName } = props;
    const initials = useMemo(() => {
        // let arr_n = name.split(" ").map(i => i.trim()).filter(i => i.length > 2);
        // return `${arr_n[0][0]}${arr_n[arr_n.length - (arr_n.length > 2 ? 2 : 1)][0]}`
        return `${name?.split(" ").filter(i => i.length > 2)[0][0]}${lastName?.split(" ").filter(i => i.length > 2)[0][0] || ""}`
    }, [name, lastName])

    const [avatar, setAvatar] = useState(picture)

    const styleContainer = {
        with: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px 0px 0px 0px",
        // margin: "30px 0px 0px 0px",
    }

    const styleAvatar = {
        height: "70px",
        width: "70px",
        backgroundColor: "#eee",
        borderRadius: "100%",
        border: "1px solid #eee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "25px",
        fontWeight: "600",
        color: "gray",
        marginBottom: "7px",
        overflow: "hidden"
    }

    const styleText = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        padding: "5px 25px",
        color: "gray"
    }

    const pictureFail = function (e) {
    }

    return (
        <div style={styleContainer}>
            <div style={styleAvatar} className="text-uppercase">
                {!!(avatar) ?
                    <img src={avatar} className="img-fluid img-thumbnail rounded-circle"
                        height="100%" onError={(e) => { setAvatar(null) }} />
                    :
                    initials
                }
            </div>
            {!(hideName) && <div style={styleText}>{name} {lastName}</div>}
        </div>
    );
};

export default Avatar;