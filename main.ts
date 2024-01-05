'use strict';

interface Client {
    nome: string;
    email: string;
    celular: string;
    cidade: string;
    index?: number;
}

const openModal = (): void => {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('active');
    }
};

const closeModal = (): void => {
    clearFields();
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
    }
};

const getLocalStorage = (): Client[] => JSON.parse(localStorage.getItem('db_client') || '[]');
const setLocalStorage = (dbClient: Client[]): void => {
    localStorage.setItem('db_client', JSON.stringify(dbClient));
};

// CRUD - create read update delete
const deleteClient = (index: number): void => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
};

const updateClient = (index: number, client: Client): void => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
};

const readClient = (): Client[] => getLocalStorage();

const createClient = (client: Client): void => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
};

const isValidFields = (): boolean => {
    const form = document.getElementById('form') as HTMLFormElement | null;
    return form ? form.reportValidity() : false;
};

// Interação com o layout

const clearFields = (): void => {
    const fields = document.querySelectorAll('.modal-field') as NodeListOf<HTMLInputElement>;
    fields.forEach((field) => (field.value = ''));
    const nomeInput = document.getElementById('nome') as HTMLInputElement | null;
    if (nomeInput) {
        nomeInput.dataset.index = 'new';
    }
    const modalHeader = document.querySelector('.modal-header>h2');
    if (modalHeader) {
        modalHeader.textContent = 'Novo Cliente';
    }
};

const saveClient = (): void => {
    if (isValidFields()) {
        const client: Client = {
            nome: (document.getElementById('nome') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            celular: (document.getElementById('celular') as HTMLInputElement).value,
            cidade: (document.getElementById('cidade') as HTMLInputElement).value,
        };
        const index = parseInt((document.getElementById('nome') as HTMLInputElement).dataset.index || '0');
        if (index === 0) {
            createClient(client);
            updateTable();
            closeModal();
        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    }
};

const createRow = (client: Client, index: number): void => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
    const tableBody = document.querySelector('#tableClient>tbody');
    if (tableBody) {
        tableBody.appendChild(newRow);
    }
};

const clearTable = (): void => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach((row) => row.parentNode?.removeChild(row));
};

const updateTable = (): void => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
};

const fillFields = (client: Client): void => {
    const nomeInput = document.getElementById('nome') as HTMLInputElement | null;
    if (nomeInput) {
        nomeInput.value = client.nome;
        nomeInput.dataset.index = client.index?.toString() || '0';
    }
    (document.getElementById('email') as HTMLInputElement).value = client.email;
    (document.getElementById('celular') as HTMLInputElement).value = client.celular;
    (document.getElementById('cidade') as HTMLInputElement).value = client.cidade;
};

const editClient = (index: number): void => {
    const client = readClient()[index];
    client.index = index;
    fillFields(client);
    const modalHeader = document.querySelector('.modal-header>h2');
    if (modalHeader) {
        modalHeader.textContent = `Editando ${client.nome}`;
    }
    openModal();
};

const editDelete = (event: Event): void => {
    if ((event.target as HTMLButtonElement).type === 'button') {
        const [action, index] = (event.target as HTMLButtonElement).id.split('-');

        if (action === 'edit') {
            editClient(parseInt(index));
        } else {
            const client = readClient()[parseInt(index)];
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`);
            if (response) {
                deleteClient(parseInt(index));
                updateTable();
            }
        }
    }
};

updateTable();

// Eventos
document.getElementById('cadastrarCliente')?.addEventListener('click', openModal);
document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('salvar')?.addEventListener('click', saveClient);
document.querySelector('#tableClient>tbody')?.addEventListener('click', editDelete);
document.getElementById('cancelar')?.addEventListener('click', closeModal);
