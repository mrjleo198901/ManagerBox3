### Alert properties
- `type` (`?:string='warning'`) - provide one of the four supported contextual classes:
`success`,`info`, `warning`, `danger`
- `dismissible` (`?:boolean=false`) - determines if an inline close button is displayed
- `dismissOnTimeout` (`?number=0`) - number of milliseconds, if specified sets a timeout duration, after which the alert will be closed

### Alert events
- `close` - fired when `alert` closed with inline button or by timeout, `$event` is an instance of `Alert` component
