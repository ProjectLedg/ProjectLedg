import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function CompanyCard({ handleCompanySelect, companyId, companyName, orgNumber, imageUrl }) {
    return (
        <article 
        onClick={() => handleCompanySelect({ companyId, companyName, orgNumber, imageUrl })} 
        className="flex-shrink-0 w-48 h-48 bg-white rounded-lg p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all ease-in-out duration-150 relative group border border-green-100 flex flex-col items-center justify-center">
            {/* <img 
                src={imageUrl} 
                alt={companyName} 
                className="w-20 h-20 rounded-full mb-2 company-icons object-cover"
                draggable="false"
            /> */}
            <Avatar className={`w-20 h-20 p-[0.125rem] border-2 border-green-500 rounded-full `}>
                {/* <AvatarImage src={user.avatarUrl} alt={user.name} /> */}
                <AvatarFallback className="bg-green-50 dark:bg-green-900 text-green-500 text-4xl font-medium">{companyName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold text-center text-green-600 mb-1">{companyName}</h3>
            <p className="text-sm text-center text-gray-500">{orgNumber}</p>
            <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-150"></div>
        </article>
    )
}