import { viewPokemon } from "./API.js";
import { typeColors } from "./objectsSources.js"


window.addEventListener("DOMContentLoaded", async () => {
    const viewName = document.querySelector("#viewName");
    const viewType = document.querySelector("#viewType");
    const viewNumber = document.querySelector("#viewNumber");
    const viewHeight = document.querySelector("#viewHeight");
    const viewWeight = document.querySelector("#viewWeight");
    const viewExp = document.querySelector("#viewExp");
    const viewExpNumber = document.querySelector("#viewExpNumber");
    const viewSprite = document.querySelector("#viewSprite");
    const viewAbilities = document.querySelector("#viewAbilities");
    const viewDescription = document.querySelector("#viewDescription");

    const params = new URLSearchParams(window.location.search);
    const pokemonId = params.get('id');

    const { stats, description } = await viewPokemon(pokemonId);//se lo enviamos a la funcion para que haga la peticion a la api

    const { id, name, base_experience, height, weight, abilities, sprites: { front_default, front_shiny }, types } = stats;

    const { flavor_text_entries } = description;

    //obtenemos la descripcion del pokemon
    const pokemonDescription = flavor_text_entries[0].flavor_text;

    //cambiar el numero a uno más "estetico"
    const numberTransofrom = (id) => {
        const originalNumber = id.toString();
        if (originalNumber.length === 2) {
            const newNumber = `#0${originalNumber}`;
            return newNumber;

        } else if (originalNumber.length === 1) {
            const newNumber = `#00${originalNumber}`;
            return newNumber;
        } else {
            const newNumber = `#${originalNumber}`;
            return newNumber;
        }
    };

    viewName.textContent = name;

    const tipos = types.map(t => t.type.name);
    tipos.forEach(tipo => {

        // Contenedor principal
        const typeInfo = document.createElement("div");
        typeInfo.classList.add(
            "flex", "items-center", "overflow-hidden", "bg-gray-200", "border-[3px]", "border-black", "rounded-4xl"
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
        viewType.appendChild(typeInfo);
    });

    viewNumber.textContent = numberTransofrom(id);
    viewWeight.textContent = `${weight * 0.1} Kg`;
    viewHeight.textContent = `${(height * 0.1).toFixed(1)} M`;
    viewExp.setAttribute("value", base_experience);
    viewExpNumber.innerHTML = `${base_experience} <span class="text-cyan-500 font-bold">PE</span>`;
    viewSprite.src = `https://play.pokemonshowdown.com/sprites/ani/${name.toLowerCase()}.gif`;

    function abilitiesDescription() {
        (async () => {
            for (const abilidad of abilities) {
                // Contenedor general para agrupar ambos bloques
                const abilityBlock = document.createElement("div");
                abilityBlock.classList.add("mb-4");

                // Bloque para el nombre de la habilidad
                const nameBlock = document.createElement("div");
                nameBlock.classList.add("bg-gray-300", "font-bold", "w-full", "px-4", "py-2", "text-lg", "mb-1", "shadow-md");
                nameBlock.textContent = abilidad.ability.name;

                // obtener la entrada de la habilidad
                const abilityUrl = await fetch(abilidad.ability.url);
                const abilityData = await abilityUrl.json();

                const entry = abilityData.flavor_text_entries.find(e => e.language.name === "en");
                const abilityDescription = entry ? entry.flavor_text : "No description available";

                // Bloque para la descripción
                const descBlock = document.createElement("div");
                descBlock.classList.add("bg-white", "px-4", "py-2", "shadow-md");
                descBlock.textContent = abilityDescription;

                // Agrega ambos bloques al contenedor principal
                abilityBlock.appendChild(nameBlock);
                abilityBlock.appendChild(descBlock);
                viewAbilities.appendChild(abilityBlock);
            }
        })();
    };

    abilitiesDescription();

    viewDescription.textContent = pokemonDescription;

})