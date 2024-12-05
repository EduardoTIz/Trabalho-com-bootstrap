document.addEventListener("DOMContentLoaded", () => {
    const livros = JSON.parse(localStorage.getItem("livros")) || [];
    let livroIndexEditando = null;

    const tabelaLivros = document.getElementById("tabelaLivros");
    const carouselItems = document.getElementById("carouselItems");
    const salvarLivro = document.getElementById("salvarLivro");
    const salvarEdicao = document.getElementById("salvarEdicao");

    function atualizarLocalStorage() {
        localStorage.setItem("livros", JSON.stringify(livros));
    }

    salvarLivro.addEventListener("click", () => {
        const titulo = document.getElementById("titulo").value.trim();
        const autor = document.getElementById("autor").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const urlImagem = document.getElementById("urlImagem").value.trim();

        // Verifica se o livro já existe na lista
        const livroExistente = livros.find(livro => livro.titulo.toLowerCase() === titulo.toLowerCase());

        if (livroExistente) {
            // Aumenta a quantidade do livro existente
            livroExistente.quantidade += 1;
        } else {
            // Adiciona o novo livro
            livros.push({ id: livros.length + 1, titulo, autor, descricao, urlImagem, quantidade: 1 });
        }

        atualizarLocalStorage();
        atualizarTabela();

        // Limpa o formulário
        document.getElementById("formLivro").reset();

        // Fecha o modal
        bootstrap.Modal.getInstance(document.getElementById("modalLivro")).hide();
    });

    salvarEdicao.addEventListener("click", () => {
        if (livroIndexEditando !== null) {
            const titulo = document.getElementById("editarTitulo").value.trim();
            const autor = document.getElementById("editarAutor").value.trim();
            const descricao = document.getElementById("editarDescricao").value.trim();
            const urlImagem = document.getElementById("editarUrlImagem").value.trim();

            livros[livroIndexEditando] = { ...livros[livroIndexEditando], titulo, autor, descricao, urlImagem };
            livroIndexEditando = null;
            atualizarLocalStorage();
            atualizarTabela();
            bootstrap.Modal.getInstance(document.getElementById("modalEditarLivro")).hide();
        }
    });

    function atualizarTabela() {
        tabelaLivros.innerHTML = "";

        livros.forEach((livro, index) => {
            livro.id = index + 1;

            tabelaLivros.innerHTML += `
                <tr>
                    <td>${livro.id}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.descricao}</td>
                    <td>${livro.quantidade}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" onclick="editarLivro(${index})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="removerLivro(${index})">Excluir</button>
                    </td>
                </tr>
            `;
        });

        atualizarCarrossel();
    }

    function atualizarCarrossel() {
        carouselItems.innerHTML = "";
        livros.forEach((livro, index) => {
            carouselItems.innerHTML += `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <img src="${livro.urlImagem}" class="d-block w-100" alt="${livro.titulo}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${livro.titulo}</h5>
                        <p>${livro.descricao}</p>
                    </div>
                </div>
            `;
        });
    }

    window.editarLivro = (index) => {
        livroIndexEditando = index;
        const livro = livros[index];

        document.getElementById("editarTitulo").value = livro.titulo;
        document.getElementById("editarAutor").value = livro.autor;
        document.getElementById("editarDescricao").value = livro.descricao;
        document.getElementById("editarUrlImagem").value = livro.urlImagem;

        new bootstrap.Modal(document.getElementById("modalEditarLivro")).show();
    };

    window.removerLivro = (index) => {
        livros.splice(index, 1);
        atualizarLocalStorage();
        atualizarTabela();
    };

    atualizarTabela();
});
