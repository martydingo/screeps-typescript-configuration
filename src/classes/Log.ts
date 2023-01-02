import { profile } from "Profiler";
@profile
export class Log {
  private static LogColor: LogColor = {
    Emergency: '<font color="#ff0000">',
    Alert: '<font color="#c00000">',
    Critical: '<font color="#c00000">',
    Error: '<font color="#cc5500">',
    Warning: '<font color="#eeaa00">',
    Notice: '<font color="#eeff00">',
    Informational: '<font color="#aaaaaa">',
    Debug: '<font color="#666666">'
  };
  public static Emergency(msg: string): void {
    console.log(Log.LogColor.Emergency + msg);
  }
  public static Alert(msg: string): void {
    console.log(Log.LogColor.Alert + msg);
  }
  public static Critical(msg: string): void {
    console.log(Log.LogColor.Critical + msg);
  }
  public static Error(msg: string): void {
    console.log(Log.LogColor.Error + msg);
  }
  public static Warning(msg: string): void {
    console.log(Log.LogColor.Warning + msg);
  }
  public static Notice(msg: string): void {
    console.log(Log.LogColor.Notice + msg);
  }
  public static Informational(msg: string): void {
    console.log(Log.LogColor.Informational + msg);
  }
  public static Debug(msg: string): void {
    console.log(Log.LogColor.Debug + msg);
  }
}
