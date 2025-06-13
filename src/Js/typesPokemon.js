import { typeColors } from "./constants.js";
export function extractTypes(wichContainer, tipos, borderColor) {
    const spinnerShow = document.getElementById('spinner');
    spinnerShow.classList.remove("hidden");

    tipos.forEach(tipo => {

        // Contenedor principal
        const typeInfo = document.createElement("div");
        typeInfo.classList.add(
            "flex", "items-center", "overflow-hidden", "bg-gray-200", "border-[3px]", `border-${borderColor}`, "rounded-4xl"
        );

        // Icono con fondo de tipo e inclinación
        const iconBg = document.createElement("div");
        iconBg.classList.add(
            "flex", "items-center", "justify-center",
            "w-10", "h-8", "shadow-2xl", "skew-x-[-20deg]", "-ml-[1px]"
        ); // <-- Agrega un margen izquierdo negativo
        iconBg.style.backgroundColor = typeColors[tipo] || "#FFD700";

        const icon = document.createElement("img");
        icon.src = `./src/SVG/${tipo}.svg`;
        icon.alt = tipo;
        icon.classList.add("w-6", "h-6", "skew-x-[20deg]");

        iconBg.appendChild(icon);

        // Nombre del tipo con fondo gris
        const typeName = document.createElement("span");
        typeName.textContent = tipo.toUpperCase();
        typeName.classList.add(
            "flex-1", "font-bold", "text-center", "text-gray-900",
            "bg-gray-200", "px-3", "py-1"
        );

        typeInfo.appendChild(iconBg);
        typeInfo.appendChild(typeName);
        wichContainer.appendChild(typeInfo);
    });
    spinnerShow.classList.add("hidden");

}   
