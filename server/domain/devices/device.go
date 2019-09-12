package devices

type DeviceState int

const (
	StatusOffline DeviceState = iota
	StatusPending
	StatusEnabling
	StatusOnline
	StatusFailure
)
