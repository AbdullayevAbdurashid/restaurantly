import React from 'react'
import "./card.css"
function Card({ name, colorIndex }) {
    const gradientList = [
        "#0F384F",
        "#AD0B0B",
        "#088A06",
        "#3376C3",
        "#3A1B90",
        "linear-gradient(95.96deg, #12C2E9 4.82%, #AB18F3 99.99%, #000000 100%, #F64F59 100%)",
        "#0A2F67",
        "linear-gradient(94.21deg, #60DF40 -4.66%, #0DC3CE 93.91%)",
        "#3376C3",
        "#3A1B90",

    ]
    return (
        <div style={{ background: gradientList[Number(colorIndex)] }} className="card" >
            <p className="text"> Order {name}</p>
        </div>
    )
}

export default Card
