interface CategoryCheckboxProps{
   id: string,
   name: string,
   label: string,
}

export default function CategoryCheckbox( { id, name, label }: CategoryCheckboxProps ) {
   return(
      <div className="flex flex-wrap items-center">
         <input
            className="w-5 h-5 mr-2 border border-white rounded appearance-none checked:border-primary-blue checked:bg-primary-blue custom-checkbox"
            type="checkbox"
            name={name}
            id={id}
            value={id}
         />
         <label htmlFor={id}>{label}</label>
      </div>

   )
}
