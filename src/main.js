import { typeColors, regions } from "./objectsSources.js"

window.addEventListener("DOMContentLoaded", async () => {
    const pkmnContainer = document.getElementById("pkmns-container");

    const formNumber = document.querySelector("#form-number");
    const formName = document.querySelector("#form-name");

    const typeFilter = document.querySelector("#type-filter");

    const navGens = document.querySelectorAll(".navGens");    

    const filterBar = document.querySelectorAll(".filter-bar");
    // console.log(filterBar);

    let region = "kanto"; // default kanto
    let lastRegion = "kanto";// default kanto
    let activeType = "all";// default all
    let lastType = "all"; // default

    typeFilter.addEventListener("click", (e) => {
        // Detecta el tipo seleccionado correctamente
        let typeId = e.target.id;
        // Si el click fue en el IMG, toma el id del padre
        if (!typeId && e.target.parentElement) {
            typeId = e.target.parentElement.id;
        }
        // Solo si es un tipo válido
        if (typeId && typeId !== "type-filter") {
            // Quita la animación del último tipo
            if (lastType) {
                const lastTypeDiv = document.getElementById(lastType);
                if (lastTypeDiv) lastTypeDiv.classList.remove("animate-pingv2");
            }
            // Aplica la animación al tipo actual
            const currentTypeDiv = document.getElementById(typeId);
            if (currentTypeDiv) currentTypeDiv.classList.add("animate-pingv2");

            activeType = typeId;
            lastType = typeId;
            renderRegion(region, 10, activeType);
            
        }
        
    });

    navGens.forEach(link => {
        link.addEventListener("click", (e) => {
            const changeRegion = e.target.id;
            renderRegion(changeRegion);
            
        });
    });

    if (!pkmnContainer.firstChild) {
        renderRegion(region);
    };

    async function renderRegion(regionName, pokemonCallForLotes = 10, typeSelected) {
        pkmnContainer.innerHTML = "";
        typeSelected = activeType;

        const actualRegion = document.querySelector(`#${regionName}`);

        if (regionName !== lastRegion) {
            const deleteColor = document.querySelector(`#${lastRegion}`);
            deleteColor.classList.remove("bg-yellow-500");
            deleteColor.classList.add("bg-white");
            actualRegion.classList.add("bg-yellow-500");
            actualRegion.classList.remove("bg-white");
        } else {
            actualRegion.classList.add("bg-yellow-500");
            actualRegion.classList.remove("bg-white");
        };

        lastRegion = actualRegion.id;

        const { start, end } = regions[regionName];
        const ids = [];
        for (let i = start; i <= end; i++) ids.push(i);

        let pokemons = [];

        for (let i = 0; i < ids.length; i += pokemonCallForLotes) {
            const groupPokemon = ids.slice(i, i + pokemonCallForLotes);
            const batchFetches = groupPokemon.map(id =>
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json())
            );
            try {
                const batchResults = await Promise.all(batchFetches);

                if(activeType !== "all"){
                    const batchFiltrado = batchResults.filter( pokemon =>
                    pokemon.types.some(tipo => tipo.type.name === activeType) ); 
                    pokemons = pokemons.concat(batchFiltrado);
                    construirPokemon(pokemons);
                }else{
                    pokemons = pokemons.concat(batchResults);
                    construirPokemon(pokemons);
                }           
        
                
            } catch (error) {
                pkmnContainer.innerHTML = `
                    <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center py-10 bg-black/90 ">
                        <img src="./src/img/error-pokemon.png" alt="Error" class="w-40 h-40 mb-4" />
                        <p class="text-red-700 font-bold text-2xl">¡Algo salió mal!</p>
                        <p class="text-red-300 font-bold text-2xl">[Pókemon desconocido]</p>
                        <a href="index.html" class="inline-block py-1 px-4 bg-cyan-600 text-4xl text-white rounded-2xl border-black border-4">
                            Volver
                        </a>
                    </div>
                `;
            };
        };
        
        region = actualRegion.id;
    };

    formNumber.addEventListener("submit", async (e) => {
        e.preventDefault();
        searchAPI(e, "number");
        document.querySelector("#pkmns-container").scrollIntoView({ behavior: "smooth" });
    });

    formName.addEventListener("submit", async (e) => {
        e.preventDefault();
        searchAPI(e, "name");
        document.querySelector("#pkmns-container").scrollIntoView({ behavior: "smooth" });
    });


    function construirPokemon(pokemonArray) {
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

            tipos.forEach(tipo => {
                // Contenedor principal
                const typeInfo = document.createElement("div");
                typeInfo.classList.add(
                    "flex", "items-center", "w-32", "rounded-4xl", "overflow-hidden", "bg-gray-200", "border-[3px]", "border-white"
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
                    "flex-1", "font-bold", "text-center", "rounded-r-2xl", "text-gray-900",
                    "bg-gray-200", "px-3", "py-1"
                );

                typeInfo.appendChild(iconBg);
                typeInfo.appendChild(typeName);
                typeContainer.appendChild(typeInfo);
            });

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
        });
    };

    async function searchAPI(e, type) {
        let pokemon;
        if (type === "name") {
            pokemon = e.target.elements["pokemonName"].value.trim();
            pokemon.trim();
        } else {
            pokemon = e.target.elements["pokemonNumber"].value.trim();
        }
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;                                    

        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            construirPokemon([resultado]);
        } catch (error) {
            pkmnContainer.innerHTML = `
                <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center py-10 bg-black/90 ">
                    <img src="./src/img/error-pokemon.png" alt="Error" class="w-40 h-40 mb-4" />
                    <p class="text-red-700 font-bold text-2xl">¡Algo salió mal!</p>
                    <p class="text-red-300 font-bold text-2xl">[Pókemon desconocido]</p>
                    <a href="index.html" class="inline-block py-1 px-4 bg-cyan-600 text-4xl text-white rounded-2xl border-black border-4">
                        Volver
                    </a>
                </div>
            `;
        };
    };
    
});