import { viewPokemon } from "./API.js";
import { typeColors } from "./constants.js";
import { extractTypes } from "./typesPokemon.js";

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

    viewName.textContent = name.charAt(0).toUpperCase() + name.slice(1);

    const tipos = types.map(t => t.type.name);
    extractTypes(viewType, tipos, "black")

    viewNumber.textContent = numberTransofrom(id);
    viewWeight.textContent = `${weight * 0.1} Kg`;
    viewHeight.textContent = `${(height * 0.1).toFixed(1)} M`;
    viewExp.setAttribute("value", base_experience);
    viewExpNumber.innerHTML = `${base_experience} <span class="text-cyan-500 font-bold">PE</span>`;
    const animatedSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    viewSprite.src = animatedSpriteUrl;
    viewSprite.onerror = () => {
        viewSprite.src = front_default;
    };

    const adjustSpriteMargin = () => {
        if (viewSprite.clientHeight > 95) {
            viewSprite.classList.add("-mt-16");
            viewSprite.classList.remove("-mt-14");
            viewSprite.classList.remove("-mt-6");
        } else if (viewSprite.clientHeight > 85) {
            viewSprite.classList.add("-mt-14");
            viewSprite.classList.remove("-mt-10");
            viewSprite.classList.remove("-mt-6");
        } else {
            viewSprite.classList.remove("-mt-14");
            viewSprite.classList.remove("-mt-10");
            viewSprite.classList.add("-mt-6");
        }
    };

    // Después de asignar el src:
    viewSprite.onload = adjustSpriteMargin;
    viewSprite.onerror = () => {
        viewSprite.src = front_default;
        viewSprite.onload = adjustSpriteMargin;
    };

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