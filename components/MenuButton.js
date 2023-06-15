
import menu from '../public/menu.png'
import Image from "next/image"

export default function MenuButton(isSmartphoneViewEnabled) {
    return (
        <div>
            <Image
                key={menu}
                src={menu}
                width={40}
                height={40}
                objectFit="cover"
                alt="menu icon"
            />
        </div>
    )
}

