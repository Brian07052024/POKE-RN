import { typeColors, regions } from "./constants.js";
import { buildPokemon } from "./buildPokemon.js";
import { renderRegion } from "./renderRegion.js";

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

    let renderToken = 0;

    typeFilter.addEventListener("click", async (e) => {
        let typeId = e.target.id;
        if (!typeId && e.target.parentElement) {
            typeId = e.target.parentElement.id;
        }
        if (typeId && typeId !== "type-filter") {
            if (lastType) {
                const lastTypeDiv = document.getElementById(lastType);
                if (lastTypeDiv) lastTypeDiv.classList.remove("animate-pingv2");
            }
            const currentTypeDiv = document.getElementById(typeId);
            if (currentTypeDiv) currentTypeDiv.classList.add("animate-pingv2");

            activeType = typeId;
            lastType = typeId;

            // LLAMADA CORRECTA:
            const result = await renderRegion(pkmnContainer, renderToken, activeType, lastRegion, region, 50, activeType);
            region = result.region;
            lastRegion = result.lastRegion;
        }
    });

    navGens.forEach(link => {
        link.addEventListener("click", async (e) => {
            const changeRegion = e.target.id;
            const result = await renderRegion(pkmnContainer, renderToken, activeType, lastRegion, changeRegion, 50, activeType);
            region = result.region;
            lastRegion = result.lastRegion;

        });
    });

    if (!pkmnContainer.firstChild) {
        const result = await renderRegion(pkmnContainer, renderToken, activeType, lastRegion, region, 50, activeType);
        region = result.region;
        lastRegion = result.lastRegion;
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

    async function searchAPI(e, type) {
        let pokemon;
        if (type === "name") {
            pokemon = e.target.elements["pokemonName"].value.trim();
            // Solo letras y guiones
            if (!/^[a-zA-Z-]+$/.test(pokemon)) {
                pkmnContainer.innerHTML = `
                <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center py-10 bg-black/90 ">
                    <img src="./src/img/error-pokemon.png" alt="Error" class="w-40 h-40 mb-4" />
                    <p class="text-red-700 font-bold text-2xl">¡Nombre inválido!</p>
                    <p class="text-red-300 font-bold text-2xl">Solo letras y guiones permitidos.</p>
                    <a href="index.html" class="inline-block py-1 px-4 bg-cyan-600 text-4xl text-white rounded-2xl border-black border-4">
                        Volver
                    </a>
                </div>
            `;
                return;
            };
        } else {
            pokemon = e.target.elements["pokemonNumber"].value.trim();
            // Solo números
            if (!/^[0-9]+$/.test(pokemon)) {
                pkmnContainer.innerHTML = `
                <div class="absolute inset-0 flex flex-col gap-4 items-center justify-center py-10 bg-black/90 ">
                    <img src="./src/img/error-pokemon.png" alt="Error" class="w-40 h-40 mb-4" />
                    <p class="text-red-700 font-bold text-2xl">¡Número inválido!</p>
                    <p class="text-red-300 font-bold text-2xl">Solo números permitidos.</p>
                    <a href="index.html" class="inline-block py-1 px-4 bg-cyan-600 text-4xl text-white rounded-2xl border-black border-4">
                        Volver
                    </a>
                </div>
            `;
                return;
            };
        };
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;

        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            buildPokemon([resultado], pkmnContainer);
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