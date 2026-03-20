import { 
    Type, 
    Hash, 
    CheckSquare, 
    Calendar, 
    List, 
    FileText, 
    Link, 
    Mail, 
    Lock, 
    Globe, 
    Image, 
    File,
    Code
} from 'lucide-react'

export const getFieldIcon = (type: string) => {
    switch (type) {
        case 'text': return <Type className="w-3.5 h-3.5" />
        case 'number': return <Hash className="w-3.5 h-3.5" />
        case 'bool': return <CheckSquare className="w-3.5 h-3.5" />
        case 'date': return <Calendar className="w-3.5 h-3.5" />
        case 'select': return <List className="w-3.5 h-3.5" />
        case 'json': return <Code className="w-3.5 h-3.5" />
        case 'file': return <File className="w-3.5 h-3.5" />
        case 'relation': return <Link className="w-3.5 h-3.5" />
        case 'email': return <Mail className="w-3.5 h-3.5" />
        case 'password': return <Lock className="w-3.5 h-3.5" />
        case 'url': return <Globe className="w-3.5 h-3.5" />
        case 'editor': return <FileText className="w-3.5 h-3.5" />
        default: return <Type className="w-3.5 h-3.5" />
    }
}
