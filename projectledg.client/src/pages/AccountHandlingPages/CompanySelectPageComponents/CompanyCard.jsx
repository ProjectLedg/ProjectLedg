
export default function CompanyCard({ companyName, orgNumber, imageUrl }) {
    
    return (
        <article className="flex-shrink-0 w-48 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 relative group">
            <img 
                src={imageUrl} 
                alt={companyName} 
                className="w-20 h-20 rounded-full mx-auto mb-2" 
                draggable="false" // disables so users don't accidentally drag the image when click and dragging the cards
            />
            <h4 className="text-center text-gray-500 mb-2">{orgNumber}</h4>
            <h3 className="text-lg font-semibold text-center">{companyName}</h3>
            {/* <p className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 ">{orgNumber}</p> */}
        </article>
    )
}