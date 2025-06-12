import { typeColors } from "./constants.js";
import { extractTypes } from "./typesPokemon.js";

export function buildPokemon(pokemonArray, pkmnContainer) {
    pkmnContainer.innerHTML = "";

    pokemonArray.forEach(pokemon => {
        const { sprites: { front_default }, id, name, types } = pokemon;

        const colorApi = types[0].type.name;
        const colorBg = typeColors[colorApi] || "#FFFFFF";

        const tipos = types.map(t => t.type.name);

        const article = document.createElement("A");
        article.classList.add(
            "rounded-4xl", "overflow-hidden", "shadow-xl", "w-full", "border-[3px]",
            "hover:-translate-y-1", "transition", "cursor-pointer", "z-10"
        );
        article.setAttribute("id", id);
        article.setAttribute("href", `infoPoke.html?id=${id}`);


        const imageContainer = document.createElement("DIV");
        imageContainer.classList.add(
            "h-60", "relative", "flex", "items-center", "justify-center",
            "bg-cover", "bg-center", "bg-white"
        );

        const imageBg = document.createElement("IMG");
        imageBg.src = "./src/img/Pokeball.webp";
        imageBg.alt = "Pokeball background";
        imageBg.classList.add(
            "absolute", "inset-0", "w-full", "h-full", "object-cover",
            "opacity-20", "pointer-events-none", "select-none"
        );

        const imagePkmn = document.createElement("IMG");
        imagePkmn.src = front_default;
        imagePkmn.alt = name;
        imagePkmn.classList.add("relative", "z-10", "opacity-100", "size-28");

        imageContainer.appendChild(imageBg);
        imageContainer.appendChild(imagePkmn);
        article.appendChild(imageContainer);

        const overlay = document.createElement("DIV");
        overlay.style.position = "absolute";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.1)"; //Ajustar la opacidad
        overlay.style.zIndex = "1";



        const infoBg = document.createElement("DIV");
        infoBg.classList.add("bg-black", "h-32", "text-white", "flex", "flex-col", "justify-center");

        const infoContainer = document.createElement("DIV");
        infoContainer.classList.add("mx-3", "py-1", "flex", "flex-col", "gap-2");

        const pokemonData = document.createElement("DIV");
        pokemonData.classList.add("flex", "items-center", "gap-2", "justify-center");

        const pokemonSpan = document.createElement("SPAN");
        pokemonSpan.classList.add("font-bold", "text-3xl");
        pokemonSpan.textContent = `#${id}`;

        const pokemonName = document.createElement("P");
        pokemonName.classList.add("font-bold", "text-3xl");
        pokemonName.textContent = name.toUpperCase();

        const typeContainer = document.createElement("DIV");
        typeContainer.classList.add("flex", "justify-evenly", "uppercase");

        extractTypes(typeContainer, tipos, "white");

        infoBg.appendChild(infoContainer);
        pokemonData.appendChild(pokemonSpan);
        pokemonData.appendChild(pokemonName);
        infoContainer.appendChild(pokemonData);
        infoContainer.appendChild(typeContainer);
        article.appendChild(infoBg);
        pkmnContainer.appendChild(article);

        if (pokemonArray.length === 1) {
            article.classList.add("max-w-md", "mx-auto");
            pkmnContainer.classList.remove("md:grid-cols-2", "xl:grid-cols-3");
            // filterBar.forEach(ul => {
            //     ul.classList.add("hidden");
            // });

        } else {
            pkmnContainer.classList.add("md:grid-cols-2", "xl:grid-cols-3", "row-span-3");
            // filterBar.forEach(ul => {
            //     ul.classList.remove("hidden");
            // });
        }

        // Agrega eventos para animar la imagen al pasar el mouse
        article.addEventListener("mouseenter", () => {
            imagePkmn.classList.add("transition", "scale-[130%]", "-translate-y-5");
            imageContainer.style.backgroundColor = colorBg;
            imageContainer.appendChild(overlay);
            imageBg.classList.add("animate-pingv3")
        });
        article.addEventListener("mouseleave", () => {
            imagePkmn.classList.remove("scale-[130%]", "-translate-y-5");
            imageContainer.style.backgroundColor = "#FFFFFF";
            imageContainer.removeChild(overlay);
            imageBg.classList.remove("animate-pingv3")
        });
    });

};