type OwnProps = {
  idx?: number
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ToggleButton = ({ idx, checked, onChange }: OwnProps) => {
  return (
    <label htmlFor={'btnToggle' + idx} className="btn_toggle">
      <input
        type="checkbox"
        id={'btnToggle' + idx}
        onChange={onChange}
        checked={checked}
      />
      <span className="btn_toggle_handler_wrap">
        <span className="btn_toggle_handler"></span>
      </span>
    </label>
  )
}
