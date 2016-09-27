#!/bin/sh
#
# $NetBSD$
#
# PROVIDE: jingo
# REQUIRE: DAEMON

. /etc/rc.subr

name="jingo"
rcvar=$name
command="/var/www/apps/jingo/jingo"
command_interpreter="/usr/pkg/bin/node"
start_cmd="jingo_start"
stop_cmd="jingo_stop"
status_cmd="jingo_status"
pidfile_base="/var/run/jingo-"

jingo_pid()
{
	pidfile=${pidfile_base}$1
	rc_pid=`check_pidfile "$pidfile" $command $command_interpreter`
}

jingo_start()
{
	rv=0
	for site in "" $jingo_sites; do
		[ -z $site ] && continue
		jingo_pid $site
		if [ -n "${rc_pid}" ]; then
			echo "${name}/$site already running (pid=${rc_pid})."
			rv=1
			continue
		fi
		site_args=$(eval echo \$${name}_${site}_args)
		site_user=$(eval echo \$${name}_${site}_user)
		site_config=$(eval echo \$${name}_${site}_config)
		site_log=$(eval echo \${${name}_${site}_log:-/dev/null})

		echo "Starting ${name}/$site."
		doit="/bin/sh -c \"echo \\\$$ > ${pidfile} && exec /usr/bin/su ${site_user} -c 'exec ${command} ${site_args} -c ${site_config}' >${site_log} 2>&1 \" &"
		eval "${doit}"
	done
	return $rv
}

jingo_stop()
{
	rv=0
	for site in "" $jingo_sites; do
		[ -z $site ] && continue
		jingo_pid $site
		if [ -n "${rc_pid}" ]; then
			echo "Stopping ${name}/$site."
			kill -TERM ${rc_pid}
			wait_for_pids ${rc_pid}
		else
			echo "${name}/${site} is not running."
			rv=1
		fi
	done
	return $rv
}

jingo_status()
{
	rv=0
	for site in "" $jingo_sites; do
		[ -z $site ] && continue
		jingo_pid $site
		if [ -n "${rc_pid}" ]; then
			echo "${name}/${site} is running as pid ${rc_pid}."
		else
			echo "${name}/${site} is not running."
			rv=1
		fi
	done
	return $rv
}

load_rc_config $name
run_rc_command $1
