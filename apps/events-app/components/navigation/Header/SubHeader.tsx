import { useRouter } from "next/router"
import { BsArrowLeft } from "react-icons/bs"

export default function SubHeader() {
    const router = useRouter()
    const goBackToPreviousPage = () => {
        router.back()
    }
    return (
        <div className="border-b border-white/20 pl-4">
            <button className="flex items-center mb-3" onClick={goBackToPreviousPage}>
               <BsArrowLeft className="mr-2" /> Back
            </button>
        </div>
    )
}