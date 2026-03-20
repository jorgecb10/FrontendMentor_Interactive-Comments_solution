export async function getData() {
    const response = await fetch('/data.json')

    if (!response.ok) {
        throw new Error('Error loading JSON');
    }
    return response.json()
}