export const Subjects = {
    Commands: {
        Post: {
            Upsert: '',
            Delete: ''            
        },
        Site: {
            Upsert: '',
            Delete: ''                
        }
    },
    Queries: {

    }
}

function applyNamespaces(subjects, namespace) {
    Object.keys(subjects).forEach(key => {
        const value = subjects[key]
        if (typeof(value) === 'object') {
            applyNamespaces(value,  `${namespace}.${key}`)
        } else if (typeof(value === 'string')) {
            subjects[key] = `${namespace}.${key}`
        }
    })
}

applyNamespaces(Subjects, 'Content')